"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { BlockBuilder } from "@/app/admin/_components/crud/block-builder";
import { PRODUCT_BLOCK_REGISTRY } from "@/app/admin/_components/crud/product-block-registry";
import { BlockPickerModal } from "./block-picker-modal";
import type { WizardAction, WizardState } from "./wizard-store";

interface StepCustomizeProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function StepCustomize({ state, dispatch }: StepCustomizeProps) {
  return (
    <AdminFormSection
      title="Blocos customizáveis"
      description="Adicione e organize os blocos que complementam a página do produto."
    >
      <BlockBuilder
        registry={PRODUCT_BLOCK_REGISTRY}
        value={state.blocks}
        onChange={(blocks) => dispatch({ type: "set_blocks", blocks })}
        addLabel="Adicione um bloco"
        renderMenu={({ add, close }) => (
          <BlockPickerModal onAdd={add} onClose={close} />
        )}
      />
    </AdminFormSection>
  );
}
