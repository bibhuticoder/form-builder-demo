import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';

export interface DefaultDisclosureTransitionProps {
  show: boolean;
  children: React.ReactNode;
}

export const DefaultDisclosureTransition: React.FC<DefaultDisclosureTransitionProps> = ({ show, children }) => {
  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      {children}
    </Transition>
  );
};
