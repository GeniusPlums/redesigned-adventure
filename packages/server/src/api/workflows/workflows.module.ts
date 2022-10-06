import { Module } from '@nestjs/common';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workflow } from './entities/workflow.entity';
import { Audience } from '../audiences/entities/audience.entity';
import { AudiencesService } from '../audiences/audiences.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { CustomersService } from '../customers/customers.service';
import { TemplatesService } from '../templates/templates.service';
import { Template } from '../templates/entities/template.entity';
import { SlackService } from '../slack/slack.service';
import { BullModule } from '@nestjs/bull';
import { Installation } from '../slack/entities/installation.entity';
import { State } from '../slack/entities/state.entity';
import { Account } from '../accounts/entities/accounts.entity';
import { Stats } from '../audiences/entities/stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workflow,
      Account,
      Audience,
      Template,
      Installation,
      State,
      Stats,
    ]),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    BullModule.registerQueue({
      name: 'email',
    }),
    BullModule.registerQueue({
      name: 'slack',
    }),
  ],
  controllers: [WorkflowsController],
  providers: [
    WorkflowsService,
    AudiencesService,
    CustomersService,
    TemplatesService,
    SlackService,
  ],
})
export class WorkflowsModule {}
