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

export const fieldRegistry: Record<Field["type"], React.FC<{ field: any }>> = {
    heading: BuilderHeading,
    paragraph: BuilderParagraph,
    divider: BuilderDivider,
    image: BuilderImage,
    video: BuilderVideo,

    text: BuilderText,
    email: BuilderEmail,
    url: BuilderUrl,
    phone: BuilderPhone,
    number: BuilderNumber,
    textarea: BuilderTextArea,
    date: BuilderDate,
    time: BuilderTime,

    dropdown: BuilderDropdown,
    radio: BuilderRadio,
    checkbox: BuilderCheckbox,

    upload: BuilderUpload,
    captcha: BuilderCaptcha,
    button: BuilderButton
}   