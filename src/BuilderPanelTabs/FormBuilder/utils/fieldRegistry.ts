import React from "react";

import BuilderUrl from "../components/FormRenderer/elements/BuilderUrl";
import BuilderDate from "../components/FormRenderer/elements/BuilderDate";
import BuilderText from "../components/FormRenderer/elements/BuilderText";
import BuilderTime from "../components/FormRenderer/elements/BuilderTime";
import BuilderEmail from "../components/FormRenderer/elements/BuilderEmail";
import BuilderImage from "../components/FormRenderer/elements/BuilderImage";
import BuilderPhone from "../components/FormRenderer/elements/BuilderPhone";
import BuilderRadio from "../components/FormRenderer/elements/BuilderRadio";
import BuilderVideo from "../components/FormRenderer/elements/BuilderVideo";
import BuilderNumber from "../components/FormRenderer/elements/BuilderNumber";
import BuilderUpload from "../components/FormRenderer/elements/BuilderUpload";
import BuilderButton from "../components/FormRenderer/elements/BuilderButton";
import BuilderDivider from "../components/FormRenderer/elements/BuilderDivider";
import BuilderHeading from "../components/FormRenderer/elements/BuilderHeading";
import BuilderCaptcha from "../components/FormRenderer/elements/BuilderCaptcha";
import BuilderCheckbox from "../components/FormRenderer/elements/BuilderCheckbox";
import BuilderTextArea from "../components/FormRenderer/elements/BuilderTextArea";
import BuilderDropdown from "../components/FormRenderer/elements/BuilderDropdown";
import BuilderParagraph from "../components/FormRenderer/elements/BuilderParagraph";
import { Field } from "../../../types";

export interface FieldComponentProps {
    field: Field;
    isSelected?: boolean;
    activeSubElement?: string | null;
}

export const fieldRegistry: Record<Field["type"], React.FC<FieldComponentProps>> = {
    heading: BuilderHeading as React.FC<FieldComponentProps>,
    paragraph: BuilderParagraph as React.FC<FieldComponentProps>,
    divider: BuilderDivider as React.FC<FieldComponentProps>,
    image: BuilderImage as React.FC<FieldComponentProps>,
    video: BuilderVideo as React.FC<FieldComponentProps>,

    text: BuilderText as React.FC<FieldComponentProps>,
    email: BuilderEmail as React.FC<FieldComponentProps>,
    url: BuilderUrl as React.FC<FieldComponentProps>,
    phone: BuilderPhone as React.FC<FieldComponentProps>,
    number: BuilderNumber as React.FC<FieldComponentProps>,
    textarea: BuilderTextArea as React.FC<FieldComponentProps>,
    date: BuilderDate as React.FC<FieldComponentProps>,
    time: BuilderTime as React.FC<FieldComponentProps>,

    dropdown: BuilderDropdown as React.FC<FieldComponentProps>,
    radio: BuilderRadio as React.FC<FieldComponentProps>,
    checkbox: BuilderCheckbox as React.FC<FieldComponentProps>,

    upload: BuilderUpload as React.FC<FieldComponentProps>,
    captcha: BuilderCaptcha as React.FC<FieldComponentProps>,
    button: BuilderButton as React.FC<FieldComponentProps>
}