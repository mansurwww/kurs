"""Add courses, course_enrollments, notifications, and file_url

Revision ID: 0002_add_courses_notifications_files
Revises: 0001_initial_tables
Create Date: 2026-11-07 14:22:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0002_add_courses_notifications_files'
down_revision: Union[str, None] = '0001_initial_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. courses кестесі
    op.create_table(
        'courses',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('code', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('teacher_id', sa.String(length=64), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index(op.f('ix_courses_code'), 'courses', ['code'], unique=True)

    # 2. course_enrollments кестесі
    op.create_table(
        'course_enrollments',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column('course_id', sa.Integer(), sa.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False),
        sa.Column('student_id', sa.String(length=64), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('enrolled_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # 3. notifications кестесі
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column('user_id', sa.String(length=64), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False, server_default='system'),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index(op.f('ix_notifications_user_id'), 'notifications', ['user_id'], unique=False)

    # 4. task_submissions кестесіне file_url бағанын қосу
    op.add_column('task_submissions', sa.Column('file_url', sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column('task_submissions', 'file_url')
    op.drop_index(op.f('ix_notifications_user_id'), table_name='notifications')
    op.drop_table('notifications')
    op.drop_table('course_enrollments')
    op.drop_index(op.f('ix_courses_code'), table_name='courses')
    op.drop_table('courses')

