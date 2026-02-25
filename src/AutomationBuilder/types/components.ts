export type TriggerKind =
    | 'form_submitted'
    | 'tag_event'
    | 'contact_event'
    | 'company_event'
    | 'birthday'
    | 'note_added'
    | 'engagement_score'
    | 'do_not_disturb'
    | 'direct_message'
    | 'comment'
    | 'call_status';

export type ActionKind =
    | 'send_email'
    | 'send_sms'
    | 'send_notification'
    | 'update_contact'
    | 'update_company'
    | 'task_update'
    | 'add_note'
    | 'tag_update'
    | 'review_autopilot'
    | 'send_to_slack'
    | 'send_to_teams'
    | 'send_to_automation'
    | 'end_automation';

export type LogicKind = 'if_else' | 'split_test' | 'loop_back';

export type TriggerConfig = {
    triggerKind: TriggerKind;
    filters?: Array<{ field: string; operator: string; value: unknown }>;
};

export type ActionConfig = {
    actionKind: ActionKind;
    payload?: Record<string, unknown>;
};

export type LogicConfig =
    | {
        logicKind: 'if_else';
        conditions: Array<{ field: string; operator: string; value: unknown }>;
    }
    | {
        logicKind: 'split_test';
        weights: number[];
    }
    | {
        logicKind: 'loop_back';
        maxLoops: number;
        targetNodeId?: string;
    };

export type DelayConfig = {
    amount: number;
    unit: 'minutes' | 'hours' | 'days';
};

export type NodeConfig = TriggerConfig | ActionConfig | LogicConfig | DelayConfig | Record<string, unknown>;
