from django.db import connection

def get_schedule_info(student_id, subject_id):
    query = """
    WITH week AS (
        SELECT date_trunc('week', CURRENT_DATE)::date AS week_start
    )
    SELECT DISTINCT ON (sch.schedule_id)
        st.student_id,
        st.fullname AS student_name,
        sub.subject_name,
        cl.class_name,
        sh.start_time AS shift_start_time,
        sch.start_time::time AS lesson_start,
        CASE 
            WHEN sch.repeat_weekly = '1' THEN
                w.week_start::timestamp 
                + ((COALESCE(sch.day_of_week, EXTRACT(ISODOW FROM sch.start_time)::int) - 1) || ' day')::interval
                + sch.start_time::time
            ELSE sch.start_time
        END AS occurrence_start
    FROM schedules AS sch
    JOIN subjects AS sub ON sub.subject_id = sch.subject_id_id
    JOIN classes AS cl ON cl.class_id = sch.class_id_id
    JOIN subject_registration_requests AS srr ON srr.schedule_id = sch.schedule_id
    JOIN lesson_slots AS ls ON ls.slot_id = sch.slot_id
    JOIN shifts AS sh ON sh.shift_id = ls.shift_id_id
    JOIN students AS st ON st.student_id = srr.student_id
    CROSS JOIN week w
    WHERE srr.status = 'approved'
    AND srr.student_id = %s
    AND sub.subject_id = %s
    LIMIT 1
    """
    with connection.cursor() as cursor:
        cursor.execute(query, [student_id, subject_id])
        row = cursor.fetchone()
        if not row:
            return None
        # mapping column names (as defined in the query)
        return {
            "student_id": row[0],
            "student_name": row[1],
            "subject_name": row[2],
            "class_name": row[3],
            "shift_start_time": row[4],
            "lesson_start": row[5],
            "occurrence_start": row[6],
        }
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_notification_to_user(account_id, data: dict):
    """
    Gửi thông báo realtime đến user qua Channels Layer.
    """
    channel_layer = get_channel_layer()
    if not channel_layer:
        print("[Realtime] Channel layer chưa được cấu hình.")
        return

    group_name = f"user_{account_id}"

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_notification",
            "content": data,
        },
    )
