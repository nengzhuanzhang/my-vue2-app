import { createLocalVue } from "@vue/test-utils";
import Vant from "vant";
const testVue = createLocalVue();
testVue.use(Vant);
export const localVue = testVue;
