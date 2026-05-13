import type { Node } from 'reactflow';
import type { AutomationValidationError } from '../types/automation';

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

function getDataRecord(node: Node): Record<string, unknown> {
    return asRecord(node.data) || {};
}

function getConfigRecord(node: Node): Record<string, unknown> | null {
    const data = getDataRecord(node);
    return asRecord(data.config);
}

function getNodeLabel(node: Node): string | undefined {
    const data = getDataRecord(node);
    const directLabel = data.label;
    if (typeof directLabel === 'string' && directLabel.trim()) return directLabel;

    const ui = asRecord(data.ui);
    const uiLabel = ui?.label;
    if (typeof uiLabel === 'string' && uiLabel.trim()) return uiLabel;

    return undefined;
}

function isActionType(nodeType?: string): boolean {
    return typeof nodeType === 'string' && (nodeType === 'action' || nodeType.startsWith('action_'));
}

function isLogicType(nodeType?: string): boolean {
    return (
        nodeType === 'condition' ||
        nodeType === 'loopBack' ||
        nodeType === 'loop_back' ||
        nodeType === 'logic_if_else' ||
        nodeType === 'logic_split_test' ||
        nodeType === 'split_test'
    );
}

export function validateTriggerConfig(config: unknown, path: string): AutomationValidationError[] {
    const errors: AutomationValidationError[] = [];
    const obj = asRecord(config);
    if (!obj) {
        errors.push({ path, message: 'Trigger config must be an object.', type: 'invalid_type' });
        return errors;
    }

    const triggerKind = typeof obj.triggerKind === 'string' ? obj.triggerKind : obj.triggerType;
    const normalized = typeof triggerKind === 'string' ? triggerKind.toLowerCase() : undefined;
    if (typeof triggerKind !== 'string' || (!TRIGGER_KINDS.has(normalized || '') && typeof obj.triggerType !== 'string')) {
        errors.push({ path: `${path}.triggerKind`, message: 'Trigger must define a valid trigger kind/type.', type: 'invalid_value' });
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

    const actionKind =
        typeof obj.actionKind === 'string'
            ? obj.actionKind
            : typeof obj.actionType === 'string'
                ? obj.actionType
                : undefined;
    if (typeof actionKind === 'string') {
        const normalized = actionKind.toLowerCase();
        if (!ACTION_KINDS.has(normalized)) {
            errors.push({ path: `${path}.actionKind`, message: 'Action kind/type is invalid.', type: 'invalid_value' });
        }
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
        const branches = obj.branches;
        const conditions = obj.conditions;

        if (Array.isArray(branches)) {
            if (branches.length === 0) {
                errors.push({ path: `${path}.branches`, message: 'If / Else must define at least 1 branch.', type: 'invalid_value' });
            }
            branches.forEach((branch, idx) => {
                const branchRecord = asRecord(branch);
                if (!branchRecord || !Array.isArray(branchRecord.conditions)) {
                    errors.push({ path: `${path}.branches[${idx}].conditions`, message: 'Each branch must define a conditions array.', type: 'invalid_type' });
                }
            });
        } else if (!Array.isArray(conditions)) {
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
    const label = getNodeLabel(node);

    if (!label) {
        errors.push({ path: `${path}.data.ui.label`, message: 'Node must have a non-empty label.', type: 'required' });
    }

    const config = getConfigRecord(node);
    if (!config) {
        return errors;
    }

    if (node.type === 'trigger') {
        errors.push(...validateTriggerConfig(config, `${path}.data.config`));
    } else if (isActionType(node.type)) {
        errors.push(...validateActionConfig(config, `${path}.data.config`));
    } else if (isLogicType(node.type)) {
        if (node.type === 'loop_back') {
            errors.push(...validateLogicConfig({ ...config, logicKind: 'loop_back' }, `${path}.data.config`));
        } else if (node.type === 'logic_if_else') {
            errors.push(...validateLogicConfig({ ...config, logicKind: 'if_else' }, `${path}.data.config`));
        } else if (node.type === 'logic_split_test' || node.type === 'split_test') {
            errors.push(...validateLogicConfig({ ...config, logicKind: 'split_test' }, `${path}.data.config`));
        } else {
            errors.push(...validateLogicConfig(config, `${path}.data.config`));
        }
    } else if (node.type === 'delay') {
        const amount = config.amount ?? config.durationValue;
        const unit = config.unit ?? config.durationUnit;
        errors.push(...validateDelayConfig({ amount, unit }, `${path}.data.config`));
    }

    return errors;
}
