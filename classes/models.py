from django.db import models
from students.models import Department, Student
from subjects.models import AcademicYear, Subject, Shift
from rooms.models import Room
from lecturers.models import Lecturer
from helper.generate_random_code import generate_random_code


class Class(models.Model):
    class_id = models.BigAutoField(primary_key=True)
    class_name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    status = models.CharField(max_length=1, default='1')
    class_code = models.UUIDField(default=generate_random_code, unique=True)

    class Meta:
        db_table = 'classes'
        indexes = [
            models.Index(fields=['department_id']),
            models.Index(fields=['academic_year_id']),
        ]
        managed = True
        verbose_name = 'Class'
        verbose_name_plural = 'Classes'

    def __str__(self):
        return f"{self.class_name} ({self.class_code})"


class ClassStudent(models.Model):
    class_student_id = models.BigAutoField(primary_key=True)
    class_id = models.ForeignKey(
        Class, on_delete=models.CASCADE, related_name='class_students'
    )
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name='class_students'
    )
    # changed to BooleanField for clarity
    is_active = models.BooleanField(default=False)  # was CharField with '0'/'1'
    created_at = models.DateTimeField(auto_now_add=True)
    registration_status = models.CharField(max_length=20, default='auto')
    registered_by_account = models.ForeignKey(
        'accounts.Account', on_delete=models.CASCADE, related_name='registered_classes'
    )

    class Meta:
        db_table = 'class_students'
        indexes = [
            models.Index(fields=['class_id']),
            models.Index(fields=['student_id']),
            models.Index(fields=['registered_by_account_id'])
        ]
        verbose_name = 'Class Student'
        verbose_name_plural = 'Class Students'

    def __str__(self):
        # fixed: wrong attribute name (school_class -> class_id)
        return f"{self.student} in {self.class_id.class_name}"


class Schedule(models.Model):
    schedule_id = models.BigAutoField(primary_key=True)
    schedule_code = models.UUIDField(default=generate_random_code, unique=True)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    # changed to BooleanField for clarity
    repeat_weekly = models.BooleanField(default=False)  # was CharField with '0'/'1'
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    subject_id = models.ForeignKey(Subject, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    latitude = models.DecimalField(max_digits=10, decimal_places=5)
    longitude = models.DecimalField(max_digits=10, decimal_places=5)
    slot = models.ForeignKey("subjects.LessonSlot", on_delete=models.CASCADE)
    lesson_type = models.CharField(max_length=50)
    day_of_week = models.IntegerField(null=True)
    status = models.CharField(max_length=1, default='1', null=True)

    class Meta:
        db_table = 'schedules'
        indexes = [
            models.Index(fields=['class_id']),
            models.Index(fields=['subject_id']),
            models.Index(fields=['room_id']),
            models.Index(fields=['slot_id']),
        ]
        managed = True
        verbose_name = 'Schedule'
        verbose_name_plural = 'Schedules'

    def __str__(self):
        return f"{self.class_id.class_name} - {self.subject_id} ({self.start_time.strftime('%Y-%m-%d %H:%M')})"