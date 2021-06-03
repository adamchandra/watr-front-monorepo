import _ from 'lodash'

import {
  defineComponent,
  SetupContext,
  provide,
  Ref,
  ref,
} from '@nuxtjs/composition-api'

import * as VC from '@nuxtjs/composition-api'

import { divRef } from '~/lib/vue-composition-lib'
import { initState, awaitRef } from '~/components/basics/component-basics'
import { usePdfPageViewer } from '~/components/single-pane/page-viewer'
import { useStanzaViewer } from '~/components/single-pane/stanza-viewer'
import { TranscriptIndex } from '~/lib/transcript/transcript-index'
import { Label, PageRange, Range } from '~/lib/transcript/labels'

import NarrowingFilter from '~/components/single-pane/narrowing-filter/index.vue'
import {
  NarrowingChoice,
  ProvidedChoices,
  ProvidedChoicesTrigger
} from '~/components/single-pane/narrowing-filter/_inc'

import { groupLabelsByNameAndTags } from '~/lib/transcript/tracelogs'

import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { fetchAndDecodeTranscript } from '~/lib/data-fetch'
import { useLabelOverlay } from '~/components/single-pane/label-overlay'
import { getQueryParam } from '~/lib/url-utils'

import SplitScreen from '~/components/basics/splitscreen/index.vue'

// import { Splitpanes, Pane } from 'splitpanes'
// import 'splitpanes/dist/splitpanes.css'


interface AppState {
  showStanzaPane: boolean;
  showPageImagePane: boolean;
  showPageOverlays: boolean;
}

function awaitRefTask<T>(ref: Ref<T>): TE.TaskEither<never, T> {
  return () => awaitRef(ref).then(x => E.right(x));
}

const dbglogKeys = <A>() =>
  TE.map<A, A>((entries: A) => {
    const keys = _.keys(entries);
    const keystr = _.join(keys, ', ');
    console.log('keys', keystr);
    return entries;
  });


export default defineComponent({
  components: { NarrowingFilter, SplitScreen },

  setup(_props, _context: SetupContext) {
    const pageImageListDiv = divRef()
    const stanzaListDiv = divRef()
    const selectionFilterDiv = divRef()
    const state = initState()

    const initChoicesRef: Ref<number> = ref(0);
    provide(ProvidedChoicesTrigger, initChoicesRef);

    const choicesRef: Array<NarrowingChoice<Label[]>> = [];
    provide(ProvidedChoices, choicesRef);

    const pageLabelRefs: Array<Ref<Label[]>> = [];


    function isPageRange(r: Range): r is PageRange {
      return r.unit === 'page';
    }

    function getLabelPageNumber(l: Label): number {
      const pageRange = _.filter(l.range, isPageRange)[0];
      if (pageRange === undefined || pageRange === null) return -1;
      return pageRange.at;
    }

    const onItemsSelected = (selection: NarrowingChoice<Label[]>[]) => {
      const labels = _.flatMap(selection, choice => _.map(choice.value, l => [l, getLabelPageNumber(l)] as const));
      const grouped = _.groupBy(labels, l => l[1]);
      const pageNumbers = _.keys(grouped);
      _.each(pageNumbers, p => {
        const group = grouped[p];
        const glabels = _.map(group, g => g[0]);
        pageLabelRefs[p].value = glabels;
      });

    }

    const appStateRef: VC.UnwrapRef<AppState> = VC.reactive({
      showStanzaPane: true,
      showPageImagePane: true,
      showPageOverlays: true,
    });

    const appStateRefs: VC.ToRefs<AppState> = VC.toRefs(appStateRef);



    const run = pipe(
      TE.right({}),
      TE.bind('entryId', ({ }) => TE.fromEither(getQueryParam('id'))),
      dbglogKeys(),
      TE.bind('pageImageListDiv', ({ }) => awaitRefTask(pageImageListDiv)),
      TE.bind('stanzaListDiv', ({ }) => awaitRefTask(stanzaListDiv)),
      dbglogKeys(),
      TE.bind('selectionFilterDiv', ({ }) => awaitRefTask(selectionFilterDiv)),
      dbglogKeys(),
      TE.bind('transcript', ({ entryId }) => fetchAndDecodeTranscript(entryId)),
      dbglogKeys(),
      TE.bind('transcriptIndex', ({ transcript }) => TE.right(new TranscriptIndex(transcript))),
      dbglogKeys(),

      TE.bind('pageViewers', ({ entryId, pageImageListDiv, transcript, transcriptIndex }) => {

        const allPageLabels = transcriptIndex.getLabels([])
        const groupedLabels = groupLabelsByNameAndTags(allPageLabels);
        const labelKeys = _.keys(groupedLabels);

        const choices = _.map(labelKeys, (key, index) => ({
          index, key, value: groupedLabels[key]
        }));
        choicesRef.push(...choices);
        initChoicesRef.value += 1;

        pageLabelRefs.push(..._.map(transcript.pages, () => {
          const pageLabelRef: Ref<Label[]> = ref([]);
          return pageLabelRef;
        }));

        const inits = _.map(transcript.pages, (_, pageNumber) => {
          const mount = document.createElement('div')
          pageImageListDiv.appendChild(mount)
          const mountPoint = divRef()
          mountPoint.value = mount

          return usePdfPageViewer({ mountPoint, transcriptIndex, pageNumber, entryId, state })
            .then(pdfPageViewer => useLabelOverlay({
              state,
              transcriptIndex,
              pdfPageViewer,
              pageNumber,
              pageLabelRef: pageLabelRefs[pageNumber]
            }));
        });

        return () => Promise.all(inits).then(E.right);
      }),

      dbglogKeys(),
      TE.bind('stanzaViewers', ({ stanzaListDiv, transcript, transcriptIndex }) => {
        const inits = _.map(transcript.stanzas, (_, stanzaNumber) => {
          const mount = document.createElement('div')
          const mountPoint = divRef()
          mountPoint.value = mount
          stanzaListDiv.appendChild(mount)
          return useStanzaViewer({ mountPoint, state })
            .then(stanzaViewer => stanzaViewer.showStanza(transcriptIndex, stanzaNumber));
        });

        return () => Promise.all(inits).then(E.right);
      }),

      dbglogKeys(),
      TE.mapLeft(errors => {
        _.each(errors, error => console.log('error', error));
        return errors;
      }),
    );

    run();

    return {
      pageImageListDiv,
      stanzaListDiv,
      selectionFilterDiv,
      onItemsSelected,
      ...appStateRefs
    }
  }

})
