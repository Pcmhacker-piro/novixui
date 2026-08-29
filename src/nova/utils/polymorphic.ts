import type { ComponentPropsWithRef, ElementType, ReactElement } from "react";

/**
 * Polymorphic helpers — enable a fully-typed `as` prop on any component.
 * Inspired by Radix's approach; no `any`.
 */
type AsProp<C extends ElementType> = { as?: C };
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicProps<
  C extends ElementType,
  Props = object,
> = Props &
  AsProp<C> &
  Omit<ComponentPropsWithRef<C>, PropsToOmit<C, Props>>;

export type PolymorphicComponent<DefaultAs extends ElementType, Props = object> = <
  C extends ElementType = DefaultAs,
>(
  props: PolymorphicProps<C, Props>,
) => ReactElement | null;
