import { Module } from '@nestjs/common';

import { BillingModule } from '@/modules/core-saas/billing/billing.module';
import { InvoiceModule } from '@/modules/core-saas/billing/invoices/invoice.module';
import { PlanModule } from '@/modules/core-saas/billing/plans/plan.module';
import { SubscriptionModule } from '@/modules/core-saas/billing/subscriptions/subscription.module';
import { ManagementModule } from '@/modules/core-saas/tenants/management/management.module';
import { SettingModule } from '@/modules/core-saas/tenants/settings/setting.module';
import { TenantModule } from '@/modules/core-saas/tenants/tenant.module';

@Module({
  imports: [ManagementModule, SettingModule, TenantModule, InvoiceModule, PlanModule, SubscriptionModule, BillingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
