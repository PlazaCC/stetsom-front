"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { BlockManager } from "@/app/admin/_components/crud/block-manager";
import { PRODUCT_BLOCK_REGISTRY } from "@/app/admin/_components/crud/product-block-registry";
import type { WizardAction, WizardState } from "./wizard-store";

interface StepCustomizeProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function StepCustomize({ state, dispatch }: StepCustomizeProps) {
  return (
    <BlockManager
      registry={PRODUCT_BLOCK_REGISTRY}
      value={state.blocks}
      onChange={(blocks) => dispatch({ type: "set_blocks", blocks })}
      addLabel="Adicione um bloco"
    />
  );
}
