interface BaseSelector {
  name: string;
  selector: string;
}

interface JSONSelector extends BaseSelector {
  type: 'json';
  path: string;
}

interface SelectorSelector extends BaseSelector {
  name: string;
  selector: string;
  type: 'selector';
}

export type Selector = JSONSelector | SelectorSelector;
