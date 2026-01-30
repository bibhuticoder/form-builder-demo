/**
 * @jest-environment jsdom
 */
import { fieldRegistry } from '../fieldRegistry';

import BuilderButton from '../../components/FormRenderer/elements/BuilderButton';
import BuilderCaptcha from '../../components/FormRenderer/elements/BuilderCaptcha';
import BuilderCheckbox from '../../components/FormRenderer/elements/BuilderCheckbox';
import BuilderDate from '../../components/FormRenderer/elements/BuilderDate';
import BuilderDivider from '../../components/FormRenderer/elements/BuilderDivider';
import BuilderEmail from '../../components/FormRenderer/elements/BuilderEmail';
import BuilderHeading from '../../components/FormRenderer/elements/BuilderHeading';
import BuilderImage from '../../components/FormRenderer/elements/BuilderImage';
import BuilderNumber from '../../components/FormRenderer/elements/BuilderNumber';
import BuilderParagraph from '../../components/FormRenderer/elements/BuilderParagraph';
import BuilderPhone from '../../components/FormRenderer/elements/BuilderPhone';
import BuilderRadio from '../../components/FormRenderer/elements/BuilderRadio';
import BuilderDropdown from '../../components/FormRenderer/elements/BuilderDropdown';
import BuilderText from '../../components/FormRenderer/elements/BuilderText';
import BuilderTextArea from '../../components/FormRenderer/elements/BuilderTextArea';
import BuilderTime from '../../components/FormRenderer/elements/BuilderTime';
import BuilderUpload from '../../components/FormRenderer/elements/BuilderUpload';
import BuilderUrl from '../../components/FormRenderer/elements/BuilderUrl';
import BuilderVideo from '../../components/FormRenderer/elements/BuilderVideo';
import { FieldType } from '../../types';

describe('fieldRegistry', () => {
  it('should have all field types registered', () => {
    const expectedFieldTypes = Object.values(FieldType);
    const registeredFieldTypes = Object.keys(fieldRegistry);

    expectedFieldTypes.forEach((fieldType) => {
      expect(registeredFieldTypes).toContain(fieldType);
    });
  });

  it('should map heading to BuilderHeading component', () => {
    expect(fieldRegistry[FieldType.HEADING]).toBe(BuilderHeading);
  });

  it('should map paragraph to BuilderParagraph component', () => {
    expect(fieldRegistry[FieldType.PARAGRAPH]).toBe(BuilderParagraph);
  });

  it('should map divider to BuilderDivider component', () => {
    expect(fieldRegistry[FieldType.DIVIDER]).toBe(BuilderDivider);
  });

  it('should map image to BuilderImage component', () => {
    expect(fieldRegistry[FieldType.IMAGE]).toBe(BuilderImage);
  });

  it('should map video to BuilderVideo component', () => {
    expect(fieldRegistry[FieldType.VIDEO]).toBe(BuilderVideo);
  });

  it('should map text to BuilderText component', () => {
    expect(fieldRegistry[FieldType.TEXT]).toBe(BuilderText);
  });

  it('should map email to BuilderEmail component', () => {
    expect(fieldRegistry[FieldType.EMAIL]).toBe(BuilderEmail);
  });

  it('should map url to BuilderUrl component', () => {
    expect(fieldRegistry[FieldType.URL]).toBe(BuilderUrl);
  });

  it('should map phone to BuilderPhone component', () => {
    expect(fieldRegistry[FieldType.PHONE]).toBe(BuilderPhone);
  });

  it('should map number to BuilderNumber component', () => {
    expect(fieldRegistry[FieldType.NUMBER]).toBe(BuilderNumber);
  });

  it('should map textarea to BuilderTextArea component', () => {
    expect(fieldRegistry[FieldType.TEXTAREA]).toBe(BuilderTextArea);
  });

  it('should map date to BuilderDate component', () => {
    expect(fieldRegistry[FieldType.DATE]).toBe(BuilderDate);
  });

  it('should map time to BuilderTime component', () => {
    expect(fieldRegistry[FieldType.TIME]).toBe(BuilderTime);
  });

  it('should map dropdown to BuilderDropdown component', () => {
    expect(fieldRegistry[FieldType.DROPDOWN]).toBe(BuilderDropdown);
  });

  it('should map radio to BuilderRadio component', () => {
    expect(fieldRegistry[FieldType.RADIO]).toBe(BuilderRadio);
  });

  it('should map checkbox to BuilderCheckbox component', () => {
    expect(fieldRegistry[FieldType.CHECKBOX]).toBe(BuilderCheckbox);
  });

  it('should map upload to BuilderUpload component', () => {
    expect(fieldRegistry[FieldType.UPLOAD]).toBe(BuilderUpload);
  });

  it('should map captcha to BuilderCaptcha component', () => {
    expect(fieldRegistry[FieldType.CAPTCHA]).toBe(BuilderCaptcha);
  });

  it('should map button to BuilderButton component', () => {
    expect(fieldRegistry[FieldType.BUTTON]).toBe(BuilderButton);
  });

  it('should have all registry entries be valid React components', () => {
    Object.values(fieldRegistry).forEach((component) => {
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    });
  });

  it('should not have any undefined or null entries', () => {
    Object.entries(fieldRegistry).forEach(([key, value]) => {
      expect(value).not.toBeNull();
      expect(value).not.toBeUndefined();
    });
  });
});
