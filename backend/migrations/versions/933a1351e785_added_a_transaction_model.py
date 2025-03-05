"""added a transaction model

Revision ID: 933a1351e785
Revises: 280cf05a1eca
Create Date: 2025-03-05 16:18:45.980388

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '933a1351e785'
down_revision = '280cf05a1eca'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('transaction',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('paypal_order_id', sa.String(length=255), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('currency', sa.String(length=10), nullable=False),
    sa.Column('payer_email', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('donation_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['donation_id'], ['donation.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('donation_id'),
    sa.UniqueConstraint('paypal_order_id')
    )
    with op.batch_alter_table('donation', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_anonymous', sa.Boolean(), nullable=False))
        batch_op.add_column(sa.Column('donation_type', sa.Enum('ONE_TIME', 'RECURRING', name='donationtype'), nullable=False))
        batch_op.add_column(sa.Column('donation_frequency', sa.Enum('WEEKLY', 'MONTHLY', 'YEARLY', name='donationfrequency'), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('donation', schema=None) as batch_op:
        batch_op.drop_column('donation_frequency')
        batch_op.drop_column('donation_type')
        batch_op.drop_column('is_anonymous')

    op.drop_table('transaction')
    # ### end Alembic commands ###
