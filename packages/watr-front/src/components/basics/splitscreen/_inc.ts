import _ from 'lodash'

import {
  defineComponent,
  SetupContext,
} from '@nuxtjs/composition-api';

import { Splitpanes, Pane } from 'splitpanes'
// import 'splitpanes/dist/splitpanes.css'

export default defineComponent({
  components: { Pane, Splitpanes },

  setup(_props, _context: SetupContext) {
    //
  }
});