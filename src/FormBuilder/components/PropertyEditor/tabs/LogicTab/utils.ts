import { LogicRule, LogicEffect } from "../../../../types";
import {
    ArrowRightCircleIcon,
    ChatBubbleBottomCenterTextIcon,
    NoSymbolIcon, // Filter/Disqualify
    EyeIcon,      // Visibility
    BoltIcon
} from "@heroicons/react/24/outline";

export interface ConditionRow {
    id: string;
    field: string;
    condition: string;
    value: string;
}

export const getLogicTypeInfo = (type: string) => {
    switch (type) {
        case 'redirect': return { label: 'Redirect', className: 'bg-blue-100 text-blue-700', icon: ArrowRightCircleIcon };
        case 'message': return { label: 'Message', className: 'bg-green-100 text-green-700', icon: ChatBubbleBottomCenterTextIcon };
        case 'disqualify': return { label: 'Filter', className: 'bg-red-100 text-red-700', icon: NoSymbolIcon };
        case 'visibility': return { label: 'Visibility', className: 'bg-purple-100 text-purple-700', icon: EyeIcon };
        default: return { label: 'Logic', className: 'bg-gray-100 text-gray-700', icon: BoltIcon };
    }
};

export const getLogicTypeFromRule = (rule: LogicRule) => {
    const effect = rule.then[0]?.effect;
    if (effect === LogicEffect.NAV_REDIRECT) return 'redirect';
    if (effect === LogicEffect.UI_TOAST) return 'message';
    if (effect === LogicEffect.SUBMISSION_REJECT) return 'disqualify';
    if (effect === LogicEffect.FIELD_VISIBILITY_SET) return 'visibility';
    return 'unknown';
};
