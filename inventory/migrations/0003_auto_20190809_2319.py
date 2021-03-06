# Generated by Django 2.1.11 on 2019-08-10 06:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0002_auto_20190731_1349'),
    ]

    operations = [
        migrations.AddField(
            model_name='categories',
            name='category_heading_five',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='categories',
            name='category_heading_four',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='categories',
            name='category_heading_one',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='categories',
            name='category_heading_six',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='categories',
            name='category_heading_three',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='categories',
            name='category_heading_two',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='categories',
            name='category_id',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='jobs',
            name='job_id',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='jobs',
            name='job_name',
            field=models.CharField(choices=[('Drain Cleaning', 'Drain Cleaning'), ('Plumbing', 'Plumbing'), ('Water Heater', 'Water Heater'), ('Misc', 'Misc')], max_length=255),
        ),
        migrations.AlterField(
            model_name='parts',
            name='master_part_num',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='parts',
            name='mfg_part_num',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='parts',
            name='upc_num',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='tasks',
            name='task_id',
            field=models.CharField(max_length=100),
        ),
    ]
