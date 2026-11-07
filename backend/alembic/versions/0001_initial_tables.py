"""Initial database tables: users, tests, questions, submissions, tasks

Revision ID: 0001_initial_tables
Revises: 
Create Date: 2026-11-06 19:40:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0001_initial_tables'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users кестесі (Keycloak синхронизациясы)
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=64), primary_key=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('first_name', sa.String(length=100), nullable=True),
        sa.Column('last_name', sa.String(length=100), nullable=True),
        sa.Column('role', sa.String(length=50), nullable=False, server_default='student'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_role'), 'users', ['role'], unique=False)

    # 2. tests кестесі
    op.create_table(
        'tests',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('time_limit_minutes', sa.Integer(), nullable=False, server_default='30'),
        sa.Column('teacher_id', sa.String(length=64), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # 3. questions кестесі
    op.create_table(
        'questions',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column('test_id', sa.Integer(), sa.ForeignKey('tests.id', ondelete='CASCADE'), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('options', sa.JSON(), nullable=False),
        sa.Column('correct_answer', sa.String(length=255), nullable=False),
        sa.Column('points', sa.Integer(), nullable=False, server_default='1'),
    )

    # 4. test_submissions кестесі
    op.create_table(
        'test_submissions',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column('test_id', sa.Integer(), sa.ForeignKey('tests.id', ondelete='CASCADE'), nullable=False),
        sa.Column('student_id', sa.String(length=64), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('score', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('total_points', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('answers', sa.JSON(), nullable=False),
        sa.Column('feedback', sa.Text(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # 5. tasks кестесі
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('due_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('teacher_id', sa.String(length=64), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # 6. task_submissions кестесі
    op.create_table(
        'task_submissions',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column('task_id', sa.Integer(), sa.ForeignKey('tasks.id', ondelete='CASCADE'), nullable=False),
        sa.Column('student_id', sa.String(length=64), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('grade', sa.Integer(), nullable=True),
        sa.Column('teacher_feedback', sa.Text(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('task_submissions')
    op.drop_table('tasks')
    op.drop_table('test_submissions')
    op.drop_table('questions')
    op.drop_table('tests')
    op.drop_index(op.f('ix_users_role'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')

