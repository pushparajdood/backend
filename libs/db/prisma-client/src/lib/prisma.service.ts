import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/lms-backend/client/prisma-schema';
import { Client as SshClient } from 'ssh2';
import * as net from 'net';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private sshClient!: SshClient;
  private forwardServer!: net.Server;

  constructor(private readonly config: ConfigService) {
    super({
      datasources: { db: { url: config.get<string>('DATABASE_URL') } },
    });
  }

  async onModuleInit(): Promise<void> {
    await this.setupSshTunnel();
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.forwardServer?.close();
    this.sshClient?.end();
  }

  private setupSshTunnel(): Promise<void> {
    const sshHost     = this.config.get<string>('SSH_HOST')!;
    const sshPort     = this.config.get<number>('SSH_PORT')!  || 22;
    const sshUser     = this.config.get<string>('SSH_USER')!;
    const sshPassword = this.config.get<string>('SSH_PASSWORD')!;
    const dstHost     = this.config.get<string>('DB_HOST')!;
    const dstPort     = this.config.get<number>('DB_PORT')!   || 5432;
    const localHost   = '127.0.0.1';
    const localPort   = this.config.get<number>('LOCAL_PORT')! || 5433;

    return new Promise((resolve, reject) => {
      this.sshClient = new SshClient();

      this.sshClient
        .on('ready', () => {
          // For every new incoming connection on localPort, open a fresh
          // forwardOut channel to dstHost:dstPort
          this.forwardServer = net
            .createServer((clientSocket) => {
              this.sshClient.forwardOut(
                clientSocket.remoteAddress || localHost,
                clientSocket.remotePort || 0,
                dstHost,
                dstPort,
                (err, sshStream) => {
                  if (err) {
                    console.error('SSH forwardOut error:', err);
                    return clientSocket.destroy(err);
                  }
                  clientSocket.pipe(sshStream).pipe(clientSocket);
                }
              );
            })
            .listen(localPort, localHost, () => {
              console.log(
                `SSH tunnel established: ${localHost}:${localPort} → ${dstHost}:${dstPort}`
              );
              resolve();
            });

          this.forwardServer.on('error', (err) => {
            console.error('Local proxy server error:', err);
            reject(err);
          });
        })
        .on('error', (err) => {
          console.error('SSH connection error:', err);
          reject(err);
        })
        .connect({
          host: sshHost,
          port: sshPort,
          username: sshUser,
          password: sshPassword,
        });
    });
  }
}
