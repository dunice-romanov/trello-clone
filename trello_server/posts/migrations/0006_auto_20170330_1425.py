# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-30 14:25
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_notification'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='commentary',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='posts.Commentary'),
        ),
        migrations.AlterField(
            model_name='notification',
            name='username',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]