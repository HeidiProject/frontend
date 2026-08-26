import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { NSelect } from "naive-ui";

import SelectCampaignDropdown from "./SelectCampaignDropdown.vue";

describe("SelectCampaignDropdown", () => {
  it("maps dynamic campaigns to select options", () => {
    const wrapper = shallowMount(SelectCampaignDropdown, {
      props: {
        campaigns: [
          { campaign_id: "campaign-a", display_name: "Campaign A" },
          { campaign_id: "campaign-b", display_name: "Campaign B" },
        ],
        modelValue: "campaign-b",
      },
    });
    const select = wrapper.getComponent(NSelect);

    expect(select.props("options")).toEqual([
      { label: "Campaign A", value: "campaign-a" },
      { label: "Campaign B", value: "campaign-b" },
    ]);
    expect(select.props("value")).toBe("campaign-b");
    expect(select.props("disabled")).toBe(false);
  });

  it("is disabled when no campaigns are available", () => {
    const wrapper = shallowMount(SelectCampaignDropdown);
    const select = wrapper.getComponent(NSelect);

    expect(select.props("options")).toEqual([]);
    expect(select.props("disabled")).toBe(true);
  });

  it("emits a selected campaign", async () => {
    const wrapper = shallowMount(SelectCampaignDropdown, {
      props: {
        campaigns: [
          { campaign_id: "campaign-a", display_name: "Campaign A" },
        ],
      },
    });

    wrapper.getComponent(NSelect).vm.$emit(
      "update:value",
      "campaign-a"
    );
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("selectedCampaign")).toEqual([["campaign-a"]]);
  });
});
