from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    AttendanceSummarySerializer, AttendanceHistorySerializer, AttendanceStatisticSerializer
)

# ==================================================
# Display list attendance summary by account_id
# ==================================================
class AttendanceSummaryView(APIView):
    def get(self, request, account_id):
        query = """
            SELECT
                COUNT(a.attendance_id) AS total_sessions,
                SUM(CASE WHEN a.status = 'P' AND a.is_late = '0' THEN 1 ELSE 0 END) AS present_on_time,
                SUM(CASE WHEN a.status = 'L' AND a.is_late = '1' THEN 1 ELSE 0 END) AS late_count,
                SUM(CASE WHEN a.status = 'A' THEN 1 ELSE 0 END) AS absent_count,
                ROUND(
                    (CAST(SUM(CASE WHEN a.status IN ('P','L') THEN 1 ELSE 0 END) AS DECIMAL) 
                    / NULLIF(COUNT(a.attendance_id), 0)) * 100, 2
                ) AS attendance_rate_percent
            FROM students s
            LEFT JOIN attendances a 
                ON s.student_id = a.student_id
            JOIN accounts acc 
                ON acc.account_id = s.account_id
            WHERE acc.account_id = %s
            AND acc.is_locked = '0'
            AND acc.is_active = '1'
            AND s.status = '1'
            LIMIT 1;
        """
        with connection.cursor() as cursor:
            cursor.execute(query, [account_id])  # pass account_id as a parameter to the query
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()

        results = [dict(zip(columns, row)) for row in rows]

        serializer = AttendanceSummarySerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
# ==================================================
# Attendance history view
# ==================================================
class AttendanceHistoryView(APIView):
    def get(self, request, account_id):
        query = """
        SELECT
            att.attendance_id,
            att.attendance_code,
            att.status,
            att.attendance_type,
            att.checkin_at,
            --
            sch.schedule_id,
            sch.day_of_week,
            --
            sub.subject_name,
            --
            cl.class_name,
            --
            r.room_name,
            --
            ls.slot_name,
            ls.start_time AS lesson_start_time,
            ls.end_time AS lesson_end_time,
            --
            sh.shift_name,
            --
            l.fullname
        FROM attendances AS att
        JOIN schedules AS sch
            ON sch.schedule_id = att.schedule_id
        JOIN subjects AS sub
            ON sub.subject_id = sch.subject_id_id
        JOIN students AS st 
            ON st.student_id = att.student_id
        JOIN accounts AS acc
            ON acc.account_id = st.account_id
        JOIN classes AS cl
            ON cl.class_id = sch.class_id_id
        JOIN rooms AS r
            ON r.room_id = sch.room_id
        JOIN lesson_slots AS ls
            ON ls.slot_id = sch.slot_id
        JOIN shifts AS sh
            ON sh.shift_id = ls.shift_id_id
        JOIN lecturer_subjects AS lsub
            ON lsub.subject_id = sch.subject_id_id
        JOIN lecturers AS l
            ON l.lecturer_id = lsub.lecturer_id
        WHERE acc.account_id = %s
            AND acc.is_locked = 'false'
            AND r.status = '1'
            AND sch.status = '1'
            AND sub.status = '1'
            AND st.status = '1'
            AND cl.status = '1'
        """

        with connection.cursor() as cursor:
            cursor.execute(query, [account_id])  # pass account_id as a parameter to the query
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()

        results = [dict(zip(columns, row)) for row in rows]

        serializer = AttendanceHistorySerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
# ==================================================
# Attendance statistics view
# ==================================================
class AttendanceStatisticView(APIView):
    def get(self, request, account_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    ss.subject_id,
                    sub.subject_name,
                    COUNT(a.attendance_id) AS total_sessions,
                    SUM(CASE WHEN a.status = 'P' THEN 1 ELSE 0 END) AS present_sessions,
                    SUM(CASE WHEN a.status = 'L' THEN 1 ELSE 0 END) AS late_sessions,
                    SUM(CASE WHEN a.status = 'A' THEN 1 ELSE 0 END) AS absent_sessions
                FROM students st
                JOIN subject_registration_requests ss 
                    ON st.student_id = ss.student_id 
                   AND ss.status = 'approved'
                JOIN subjects sub 
                    ON ss.subject_id = sub.subject_id
                LEFT JOIN schedules sch 
                    ON ss.subject_id = sch.subject_id_id
                LEFT JOIN attendances a 
                    ON a.schedule_id = sch.schedule_id 
                   AND a.student_id = st.student_id
                WHERE st.account_id = %s
                GROUP BY ss.subject_id, sub.subject_name
                ORDER BY sub.subject_name;
            """, [account_id])

            rows = cursor.fetchall()

        # convert rows to a list of dictionaries
        data = [
            {
                "subject_id": row[0],
                "subject_name": row[1],
                "total_sessions": row[2],
                "present_sessions": row[3],
                "late_sessions": row[4],
                "absent_sessions": row[5],
            }
            for row in rows
        ]

        serializer = AttendanceStatisticSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)