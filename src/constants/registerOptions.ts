interface RegisterOptionsType {
  affiliation?: string; // 소속명
  license?: string; // 면허번호
  major_subject?: string; // 전공과목
  interest?: string; // 관심분야
}

enum RegisterOptions {
  affiliation = 'affiliation',
  license = 'license',
  major_subject = 'major_subject',
  interest = 'interest',
}

interface RegisterDetailOptionsState {
  idx: number;
  key: string;
  type: string;
  label: string;
  isEssential: boolean;
  value: string;
}

export { RegisterOptions };
export type { RegisterDetailOptionsState, RegisterOptionsType };
