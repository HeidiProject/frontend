import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import axiosWrapper from "../helpers/axiosWrapper";
import { useFFCSStore } from "./ffcsStore";

vi.mock("../helpers/axiosWrapper", () => ({
  default: {
    get_ffcs_campaigns: vi.fn(),
    get_summary_ffcs_results: vi.fn(),
  },
}));

vi.mock("../router", () => ({
  default: {
    push: vi.fn(),
  },
}));

describe("FFCS store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("loads campaigns independently from well data", async () => {
    const campaigns = [
      { campaign_id: "campaign-a", display_name: "Campaign A" },
      { campaign_id: "campaign-b", display_name: "Campaign B" },
    ];
    axiosWrapper.get_ffcs_campaigns.mockResolvedValue({ data: campaigns });
    const store = useFFCSStore();
    store.ffcs_data = [{ existing: "well data" }];

    const result = await store.getCampaigns("p12345");

    expect(axiosWrapper.get_ffcs_campaigns).toHaveBeenCalledWith("p12345");
    expect(result).toEqual(campaigns);
    expect(store.campaigns).toEqual(campaigns);
    expect(store.ffcs_data).toEqual([{ existing: "well data" }]);
  });

  it("clears campaigns and records an error after a failed request", async () => {
    axiosWrapper.get_ffcs_campaigns.mockRejectedValue(new Error("unavailable"));
    const store = useFFCSStore();
    store.campaigns = [{ campaign_id: "old" }];

    const result = await store.getCampaigns("p12345");

    expect(result).toEqual([]);
    expect(store.campaigns).toEqual([]);
    expect(store.getDataMsg).toContain("unavailable");
  });

  it("loads wells for the selected account and campaign", async () => {
    const wells = [{ document: [{ well: "A01" }] }];
    axiosWrapper.get_summary_ffcs_results.mockResolvedValue({ data: wells });
    const store = useFFCSStore();

    const result = await store.getFFCSData("p12345", "campaign-a");

    expect(axiosWrapper.get_summary_ffcs_results).toHaveBeenCalledWith(
      "p12345",
      "campaign-a"
    );
    expect(result).toEqual(wells);
  });
});
