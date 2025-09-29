from rest_framework import serializers

# ==================================================
# Display list attendance summary by account_id
# ==================================================
class AttendanceSummarySerializer(serializers.Serializer):
    total_sessions = serializers.IntegerField()
    present_on_time = serializers.IntegerField()
    late_count = serializers.IntegerField()
    absent_count = serializers.IntegerField()
    attendance_rate_percent = serializers.DecimalField(max_digits=5, decimal_places=2)
# ==================================================
# Attendance history serializer
# ==================================================
class AttendanceHistorySerializer(serializers.Serializer):
    attendance_id = serializers.IntegerField()
    attendance_code = serializers.UUIDField()
    status = serializers.CharField()
    attendance_type = serializers.CharField()
    checkin_at = serializers.DateTimeField()
    schedule_id = serializers.IntegerField()
    day_of_week = serializers.IntegerField()
    subject_name = serializers.CharField()
    class_name = serializers.CharField()
    room_name = serializers.CharField()
    slot_name = serializers.CharField()
    lesson_start_time = serializers.TimeField()
    lesson_end_time = serializers.TimeField()
    shift_name = serializers.CharField()
    fullname = serializers.CharField()
# ==================================================
# Attendance statistics serializer (Bar chart)
# ==================================================
class AttendanceStatisticSerializer(serializers.Serializer):
    subject_id = serializers.IntegerField()
    subject_name = serializers.CharField()
    total_sessions = serializers.IntegerField()
    present_sessions = serializers.IntegerField()
    late_sessions = serializers.IntegerField()
    absent_sessions = serializers.IntegerField()