import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {

  async getDashboard(){
    
    const data = {
          "students": {
              "count": 3354,
              "change": "1.6%"
          },
          "teachers": {
              "count": 284,
              "change": "1.1%"
          },
          "totalStaff": {
              "count": 162,
              "change": "0%"
          },
          "inactive": {
              "count": 1,
              "change": "0%"
          },
          "totalInactive": {
              "count": 82,
              "change": "0.5%"
          },
          "noticeBoard": [
              {
                  "title": "New Syllabus Instructions",
                  "addedOn": "11 Mar 2024",
                  "daysAgo": 15
              },
              {
                  "title": "World Environmental Day Program...",
                  "addedOn": "13 Apr 2024",
                  "daysAgo": 15
              },
              {
                  "title": "Exam Preparation Notification",
                  "addedOn": "13 Mar 2024",
                  "daysAgo": 12
              },
              {
                  "title": "Online Classes Preparation",
                  "addedOn": "24 May 2024",
                  "daysAgo": 62
              },
              {
                  "title": "Exam Time Table Release",
                  "addedOn": "24 May 2024",
                  "daysAgo": 59
              }
          ],
          "upcomingEvents": [
              {
                  "title": "Parents Teacher Meet",
                  "time": "10:00AM - 10:30PM",
                  "date": "July 15 2024"
              },
              {
                  "title": "Parents Teacher Meet",
                  "time": "",
                  "date": "15 July 2024"
              },
              {
                  "title": "Vacation Meeting",
                  "time": "09:00AM - 10:30PM",
                  "date": "07 July 2024 - 07 July 2024"
              }
          ],
          "schoolPerformance": {
              "period": "6 Month",
              "bars": [
                  {
                      "label": "Parent Engagement",
                      "value": 40
                  },
                  {
                      "label": "Teacher Evaluation",
                      "value": 40
                  },
                  {
                      "label": "Student Attendance",
                      "value": 40
                  }
              ]
          },
          "academicTrend": {
              "label": "Academic Trend",
              "data": [
                  {
                      "month": "Jan",
                      "value": 20
                  },
                  {
                      "month": "Feb",
                      "value": 25
                  },
                  {
                      "month": "Mar",
                      "value": 30
                  },
                  {
                      "month": "Apr",
                      "value": 35
                  },
                  {
                      "month": "May",
                      "value": 40
                  },
                  {
                      "month": "Jun",
                      "value": 45
                  },
                  {
                      "month": "Jul",
                      "value": 50
                  }
              ]
          }
      }
    return  data
  }
}
