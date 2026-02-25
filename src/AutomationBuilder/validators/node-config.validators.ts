import type { Node } from 'reactflow';
import type { AutomationNodeData, AutomationValidationError } from '../types';

const TRIGGER_KINDS = new Set([
    'form_submitted',
    'tag_event',
    'contact_event',
    'company_event',
    'birthday',
    'note_added',
    'engagement_score',
    'do_not_disturb',
    'direct_message',
    'comment',
    'call_status',
]);

const ACTION_KINDS = new Set([
    'send_email',
    'send_sms',
    'send_notification',
    'update_contact',
    'update_company',
    'task_update',
    'add_note',
    'tag_update',
    'review_autopilot',
    'send_to_slack',
    'send_to_teams',
    'send_to_automation',
    'end_automation',
]);

const LOGIC_KINDS = new Set(['if_else', 'split_test', 'loop_back']);

function asRecord(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object') return null;
    return value as Record<string, unknown>;
}

export function validateTriggerConfig(config: unknown, path: string): AutomationValidationError[] {
    const errors: AutomationValidationError[] = [];
    const obj = asRecord(config);
    if (!obj) {
        errors.push({ path, message: 'Trigger config must be an object.', type: 'invalid_type' });
        return errors;
    }

    const triggerKind = obj.triggerKind;
    if (typeof triggerKind !== 'string' || !TRIGGER_KINDS.has(triggerKind)) {
        errors.push({ path: `${path}.triggerKind`, message: 'Trigger must define a valid triggerKind.', type: 'invalid_value' });
    }

    const filters = obj.filters;
    if (filters !== undefined && !Array.isArray(filters)) {
        errors.push({ path: `${path}.filters`, message: 'filters must be an array when provided.', type: 'invalid_type' });
    }

    return errors;
}

export function validateActionConfig(config: unknown, path: string): AutomationValidationError[] {
    const errors: AutomationValidationError[] = [];
    const obj = asRecord(config);
    if (!obj) {
        errors.push({ path, message: 'Action config must be an object.', type: 'invalid_type' });
        return errors;
    }

    const actionKind = obj.actionKind;
    if (typeof actionKind !== 'string' || !ACTION_KINDS.has(actionKind)) {
        errors.push({ path: `${path}.actionKind`, message: 'Action must define a valid actionKind.', type: 'invalid_value' });
    }

    return errors;
}

export function validateLogicConfig(config: unknown, path: string): AutomationValidationError[] {
    const errors: AutomationValidationError[] = [];
    const obj = asRecord(config);
    if (!obj) {
        errors.push({ path, message: 'Logic config must be an object.', type: 'invalid_type' });
        return errors;
    }

    const logicKind = obj.logicKind;
    if (typeof logicKind !== 'string' || !LOGIC_KINDS.has(logicKind)) {
        errors.push({ path: `${path}.logicKind`, message: 'Logic must define a valid logicKind.', type: 'invalid_value' });
        return errors;
    }

    if (logicKind === 'split_test') {
        if (!Array.isArray(obj.weights) || obj.weights.length < 2 || obj.weights.some((w) => typeof w !== 'number')) {
            errors.push({ path: `${path}.weights`, message: 'Split Test must define numeric weights for at least 2 branches.', type: 'invalid_value' });
        }
    }

    if (logicKind === 'if_else') {
        if (!Array.isArray(obj.conditions)) {
            errors.push({ path: `${path}.conditions`, message: 'If / Else must define conditions array.', type: 'invalid_type' });
        }
    }

    if (logicKind === 'loop_back') {
        const maxLoops = obj.maxLoops;
        if (!Number.isInteger(maxLoops) || Number(maxLoops) <= 0) {
            errors.push({ path: `${path}.maxLoops`, message: 'Loop Back must define positive integer maxLoops.', type: 'invalid_value' });
        }
    }

    return errors;
}

export function validateDelayConfig(config: unknown, path: string): AutomationValidationError[] {
    const errors: AutomationValidationError[] = [];
    const obj = asRecord(config);
    if (!obj) {
        errors.push({ path, message: 'Delay config must be an object.', type: 'invalid_type' });
        return errors;
    }

    const amount = obj.amount;
    if (!Number.isFinite(amount) || Number(amount) <= 0) {
        errors.push({ path: `${path}.amount`, message: 'Delay must define a positive numeric amount.', type: 'invalid_value' });
    }

    const unit = obj.unit;
    if (unit !== 'minutes' && unit !== 'hours' && unit !== 'days') {
        errors.push({ path: `${path}.unit`, message: 'Delay unit must be one of: minutes, hours, days.', type: 'invalid_value' });
    }

    return errors;
}

export function validateNodeInteractiveData(node: Node, path: string): AutomationValidationError[] {
    const errors: AutomationValidationError[] = [];
    const data = (node.data || {}) as AutomationNodeData;

    if (!data.label || typeof data.label !== 'string') {
        errors.push({ path: `${path}.data.label`, message: 'Node must have a non-empty label.', type: 'required' });
    }

    if (!data.config) {
        return errors;
    }

    if (node.type === 'trigger') {
        errors.push(...validateTriggerConfig(data.config, `${path}.data.config`));
    } else if (node.type === 'action') {
        errors.push(...validateActionConfig(data.config, `${path}.data.config`));
    } else if (node.type === 'condition' || node.type === 'loopBack') {
        errors.push(...validateLogicConfig(data.config, `${path}.data.config`));
    } else if (node.type === 'delay') {
        errors.push(...validateDelayConfig(data.config, `${path}.data.config`));
    }

    return errors;
}
