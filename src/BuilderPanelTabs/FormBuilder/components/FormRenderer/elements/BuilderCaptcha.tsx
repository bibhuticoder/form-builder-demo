/** 
* BuilderCaptcha
* A React component that renders a CAPTCHA field within a form builder. 
*/

import { CaptchaField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderCaptchaProps {
  field: CaptchaField;
}

export default function BuilderCaptcha({ field }: Readonly<BuilderCaptchaProps>) {
  return (
    <BuilderFieldWrapper field={field}>
      <div className="rounded p-4 bg-gray-50 text-center border border-dashed border-gray-300">
        <p className="text-sm text-gray-600">{field.label}</p>
      </div>
    </BuilderFieldWrapper>
  );
}
