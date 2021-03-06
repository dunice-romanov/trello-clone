# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-31 07:51
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0006_auto_20170330_1425'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='commentary',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.Commentary'),
        ),
        migrations.AlterField(
            model_name='notification',
            name='username',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
