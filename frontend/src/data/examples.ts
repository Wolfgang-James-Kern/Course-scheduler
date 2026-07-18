import type { SolveRequest } from "../types";
import type { AcademicYearWorkspace } from "../academicYear.ts";
import { defaultRules } from "../requestDefaults.ts";

export type Preset = {
  label: string;
  workspace: AcademicYearWorkspace;
};

type SemesterPreset = {
  label: string;
  request: SolveRequest;
};

const SEMESTER_PRESETS: SemesterPreset[] = [
  {
    "label": "SE Year 3 - Semester 1",
    "request": {
      "topN": 10,
      "courses": [
        {
          "code": "ECE 4436A",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "10:30",
                      "endTime": "12:30"
                    },
                    {
                      "day": "THURSDAY",
                      "startTime": "17:30",
                      "endTime": "18:30"
                    }
                  ]
                },
                {
                  "id": "006",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "09:30",
                      "endTime": "11:30"
                    },
                    {
                      "day": "THURSDAY",
                      "startTime": "15:30",
                      "endTime": "16:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "002",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "17:30",
                      "endTime": "19:30"
                    }
                  ]
                },
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "13:30",
                      "endTime": "15:30"
                    }
                  ]
                },
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "16:30",
                      "endTime": "18:30"
                    }
                  ]
                },
                {
                  "id": "005",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "15:30",
                      "endTime": "17:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3309A",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "12:30",
                      "endTime": "14:30"
                    },
                    {
                      "day": "WEDNESDAY",
                      "startTime": "17:30",
                      "endTime": "18:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "002",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "09:30",
                      "endTime": "11:30"
                    }
                  ]
                },
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "09:30",
                      "endTime": "11:30"
                    }
                  ]
                },
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "08:30",
                      "endTime": "10:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3310A",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "12:30",
                      "endTime": "14:30"
                    },
                    {
                      "day": "WEDNESDAY",
                      "startTime": "12:30",
                      "endTime": "13:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "TUT",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "NON_MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "002",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "12:30",
                      "endTime": "14:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3351A",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "16:30",
                      "endTime": "17:30"
                    },
                    {
                      "day": "FRIDAY",
                      "startTime": "15:30",
                      "endTime": "17:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "TUT",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "NON_MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "002",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "15:30",
                      "endTime": "17:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3316A",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "11:30",
                      "endTime": "12:30"
                    },
                    {
                      "day": "WEDNESDAY",
                      "startTime": "15:30",
                      "endTime": "16:30"
                    },
                    {
                      "day": "THURSDAY",
                      "startTime": "16:30",
                      "endTime": "17:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "08:30",
                      "endTime": "10:30"
                    }
                  ]
                },
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "08:30",
                      "endTime": "10:30"
                    }
                  ]
                },
                {
                  "id": "005",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "13:30",
                      "endTime": "15:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3352A",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "10:30",
                      "endTime": "12:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "002",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "13:30",
                      "endTime": "15:30"
                    }
                  ]
                },
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "09:30",
                      "endTime": "11:30"
                    }
                  ]
                },
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "08:30",
                      "endTime": "10:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        }
      ],
      "rules": defaultRules()
    }
  },
  {
    "label": "SE Year 3 - Semester 2",
    "request": {
      "topN": 10,
      "courses": [
        {
          "code": "ECE 3375B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "08:30",
                      "endTime": "10:30"
                    },
                    {
                      "day": "WEDNESDAY",
                      "startTime": "15:30",
                      "endTime": "16:30"
                    }
                  ]
                },
                {
                  "id": "002",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "12:30",
                      "endTime": "14:30"
                    },
                    {
                      "day": "THURSDAY",
                      "startTime": "14:30",
                      "endTime": "15:30"
                    }
                  ]
                },
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "09:30",
                      "endTime": "11:30"
                    },
                    {
                      "day": "FRIDAY",
                      "startTime": "11:30",
                      "endTime": "12:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "meetingFrequency": "OCCASIONAL",
              "included": true,
              "sections": [
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "10:30",
                      "endTime": "13:30"
                    }
                  ]
                },
                {
                  "id": "005",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "10:30",
                      "endTime": "13:30"
                    }
                  ]
                },
                {
                  "id": "006",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "18:30",
                      "endTime": "21:30"
                    }
                  ]
                },
                {
                  "id": "007",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "18:30",
                      "endTime": "21:30"
                    }
                  ]
                },
                {
                  "id": "008",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "18:30",
                      "endTime": "21:30"
                    }
                  ]
                },
                {
                  "id": "009",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "18:30",
                      "endTime": "21:30"
                    }
                  ]
                },
                {
                  "id": "010",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "11:30",
                      "endTime": "14:30"
                    }
                  ]
                },
                {
                  "id": "011",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "11:30",
                      "endTime": "14:30"
                    }
                  ]
                },
                {
                  "id": "012",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "08:30",
                      "endTime": "11:30"
                    }
                  ]
                },
                {
                  "id": "013",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "08:30",
                      "endTime": "11:30"
                    }
                  ]
                },
                {
                  "id": "014",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "08:30",
                      "endTime": "11:30"
                    }
                  ]
                },
                {
                  "id": "015",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "08:30",
                      "endTime": "11:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3313B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "10:30",
                      "endTime": "12:30"
                    },
                    {
                      "day": "THURSDAY",
                      "startTime": "09:30",
                      "endTime": "10:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "NON_MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "09:30",
                      "endTime": "11:30"
                    }
                  ]
                },
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "12:30",
                      "endTime": "14:30"
                    }
                  ]
                },
                {
                  "id": "005",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "10:30",
                      "endTime": "12:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3353B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "13:30",
                      "endTime": "15:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "TUT",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "NON_MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "002",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "12:30",
                      "endTime": "13:30"
                    },
                    {
                      "day": "WEDNESDAY",
                      "startTime": "17:30",
                      "endTime": "18:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3350B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "13:30",
                      "endTime": "14:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "002",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "13:30",
                      "endTime": "16:30"
                    }
                  ]
                },
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "14:30",
                      "endTime": "17:30"
                    }
                  ]
                },
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "14:30",
                      "endTime": "17:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "PHYSICS 2300B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "16:30",
                      "endTime": "17:30"
                    },
                    {
                      "day": "WEDNESDAY",
                      "startTime": "16:30",
                      "endTime": "17:30"
                    },
                    {
                      "day": "FRIDAY",
                      "startTime": "16:30",
                      "endTime": "17:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3314B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "meetingFrequency": "WEEKLY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "15:30",
                      "endTime": "17:30"
                    },
                    {
                      "day": "THURSDAY",
                      "startTime": "15:30",
                      "endTime": "16:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "NON_MANDATORY",
              "meetingFrequency": "WEEKLY",
              "included": true,
              "sections": [
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "13:30",
                      "endTime": "15:30"
                    }
                  ]
                },
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "12:30",
                      "endTime": "14:30"
                    }
                  ]
                },
                {
                  "id": "005",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "13:30",
                      "endTime": "15:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        }
      ],
      "rules": defaultRules()
    }
  },
  {
    "label": "SE Year 3 w/electives - Semester 2",
    "request": {
      "topN": 10,
      "courses": [
        {
          "code": "ECE 3375B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "08:30",
                      "endTime": "10:30"
                    },
                    {
                      "day": "WEDNESDAY",
                      "startTime": "15:30",
                      "endTime": "16:30"
                    }
                  ]
                },
                {
                  "id": "002",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "12:30",
                      "endTime": "14:30"
                    },
                    {
                      "day": "THURSDAY",
                      "startTime": "14:30",
                      "endTime": "15:30"
                    }
                  ]
                },
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "09:30",
                      "endTime": "11:30"
                    },
                    {
                      "day": "FRIDAY",
                      "startTime": "11:30",
                      "endTime": "12:30"
                    }
                  ]
                }
              ],
              "meetingFrequency": "WEEKLY"
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "meetingFrequency": "OCCASIONAL",
              "included": true,
              "sections": [
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "10:30",
                      "endTime": "13:30"
                    }
                  ]
                },
                {
                  "id": "005",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "10:30",
                      "endTime": "13:30"
                    }
                  ]
                },
                {
                  "id": "006",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "18:30",
                      "endTime": "21:30"
                    }
                  ]
                },
                {
                  "id": "007",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "18:30",
                      "endTime": "21:30"
                    }
                  ]
                },
                {
                  "id": "008",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "18:30",
                      "endTime": "21:30"
                    }
                  ]
                },
                {
                  "id": "009",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "18:30",
                      "endTime": "21:30"
                    }
                  ]
                },
                {
                  "id": "010",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "11:30",
                      "endTime": "14:30"
                    }
                  ]
                },
                {
                  "id": "011",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "11:30",
                      "endTime": "14:30"
                    }
                  ]
                },
                {
                  "id": "012",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "08:30",
                      "endTime": "11:30"
                    }
                  ]
                },
                {
                  "id": "013",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "08:30",
                      "endTime": "11:30"
                    }
                  ]
                },
                {
                  "id": "014",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "08:30",
                      "endTime": "11:30"
                    }
                  ]
                },
                {
                  "id": "015",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "08:30",
                      "endTime": "11:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3313B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "meetingFrequency": "WEEKLY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "17:30",
                      "endTime": "19:30"
                    },
                    {
                      "day": "THURSDAY",
                      "startTime": "09:30",
                      "endTime": "10:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "NON_MANDATORY",
              "meetingFrequency": "WEEKLY",
              "included": true,
              "sections": [
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "09:30",
                      "endTime": "11:30"
                    }
                  ]
                },
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "12:30",
                      "endTime": "14:30"
                    }
                  ]
                },
                {
                  "id": "005",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "10:30",
                      "endTime": "12:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3353B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "WEDNESDAY",
                      "startTime": "13:30",
                      "endTime": "15:30"
                    }
                  ]
                }
              ],
              "meetingFrequency": "WEEKLY"
            },
            {
              "type": "TUT",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "NON_MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "002",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "12:30",
                      "endTime": "13:30"
                    },
                    {
                      "day": "WEDNESDAY",
                      "startTime": "17:30",
                      "endTime": "18:30"
                    }
                  ]
                }
              ],
              "meetingFrequency": "WEEKLY"
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3350B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "13:30",
                      "endTime": "14:30"
                    }
                  ]
                }
              ],
              "meetingFrequency": "WEEKLY"
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "002",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "13:30",
                      "endTime": "16:30"
                    }
                  ]
                },
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "14:30",
                      "endTime": "17:30"
                    }
                  ]
                },
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "14:30",
                      "endTime": "17:30"
                    }
                  ]
                }
              ],
              "meetingFrequency": "WEEKLY"
            }
          ],
          "compatibilities": []
        },
        {
          "code": "PHYSICS 2300B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "16:30",
                      "endTime": "17:30"
                    },
                    {
                      "day": "WEDNESDAY",
                      "startTime": "16:30",
                      "endTime": "17:30"
                    },
                    {
                      "day": "FRIDAY",
                      "startTime": "16:30",
                      "endTime": "17:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "DATASCI 3000B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "meetingFrequency": "WEEKLY",
              "included": true,
              "sections": [
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "11:30",
                      "endTime": "13:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "meetingFrequency": "WEEKLY",
              "included": true,
              "sections": [
                {
                  "id": "005",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "15:30",
                      "endTime": "17:30"
                    }
                  ]
                },
                {
                  "id": "006",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "11:30",
                      "endTime": "13:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        },
        {
          "code": "SE 3314B",
          "components": [
            {
              "type": "LEC",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "MANDATORY",
              "meetingFrequency": "WEEKLY",
              "included": true,
              "sections": [
                {
                  "id": "001",
                  "meetings": [
                    {
                      "day": "TUESDAY",
                      "startTime": "15:30",
                      "endTime": "17:30"
                    },
                    {
                      "day": "THURSDAY",
                      "startTime": "15:30",
                      "endTime": "16:30"
                    }
                  ]
                }
              ]
            },
            {
              "type": "LAB",
              "enrollmentRequirement": "REQUIRED",
              "attendanceRequirement": "NON_MANDATORY",
              "meetingFrequency": "WEEKLY",
              "included": true,
              "sections": [
                {
                  "id": "003",
                  "meetings": [
                    {
                      "day": "MONDAY",
                      "startTime": "13:30",
                      "endTime": "15:30"
                    }
                  ]
                },
                {
                  "id": "004",
                  "meetings": [
                    {
                      "day": "FRIDAY",
                      "startTime": "12:30",
                      "endTime": "14:30"
                    }
                  ]
                },
                {
                  "id": "005",
                  "meetings": [
                    {
                      "day": "THURSDAY",
                      "startTime": "13:30",
                      "endTime": "15:30"
                    }
                  ]
                }
              ]
            }
          ],
          "compatibilities": []
        }
      ],
      "rules": defaultRules()
    }
  },
  {
  "label": "EE Year 3 - Semester 1",
  "request": {
    "topN": 10,
    "courses": [
      {
        "code": "ECE 3330A",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "18:30",
                    "endTime": "20:30"
                  },
                  {
                    "day": "THURSDAY",
                    "startTime": "14:30",
                    "endTime": "15:30"
                  }
                ]
              },
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  },
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "20:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "14:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "14:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "15:30",
                    "endTime": "18:30"
                  }
                ]
              },
              {
                "id": "008",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "15:30",
                    "endTime": "18:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "ECE 3332A",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "14:30",
                    "endTime": "15:30"
                  },
                  {
                    "day": "TUESDAY",
                    "startTime": "18:30",
                    "endTime": "20:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "TUT",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "15:30",
                    "endTime": "17:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "13:30",
                    "endTime": "16:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "13:30",
                    "endTime": "16:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "14:30",
                    "endTime": "17:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "ECE 3337A",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "17:30",
                    "endTime": "18:30"
                  },
                  {
                    "day": "THURSDAY",
                    "startTime": "15:30",
                    "endTime": "17:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "18:00",
                    "endTime": "21:00"
                  }
                ]
              },
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "18:00",
                    "endTime": "21:00"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "TUT",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "13:30",
                    "endTime": "14:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "NMM 3415A",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  },
                  {
                    "day": "WEDNESDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "STATS 2141A",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "13:30",
                    "endTime": "14:30"
                  },
                  {
                    "day": "WEDNESDAY",
                    "startTime": "13:30",
                    "endTime": "14:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "13:30",
                    "endTime": "14:30"
                  }
                ]
              },
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "18:30",
                    "endTime": "19:30"
                  },
                  {
                    "day": "TUESDAY",
                    "startTime": "17:30",
                    "endTime": "18:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "12:30",
                    "endTime": "13:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "TUT",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "17:30",
                    "endTime": "18:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      }
    ],
    "rules": defaultRules()
  }
},
{
  "label": "EE Year 3 - Semester 2",
  "request": {
    "topN": 10,
    "courses": [
      {
        "code": "ECE 3331B",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "10:30",
                    "endTime": "11:30"
                  },
                  {
                    "day": "THURSDAY",
                    "startTime": "10:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  },
                  {
                    "day": "WEDNESDAY",
                    "startTime": "13:30",
                    "endTime": "15:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "11:30",
                    "endTime": "14:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "11:30",
                    "endTime": "14:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "13:30",
                    "endTime": "16:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "ECE 3333B",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "15:30",
                    "endTime": "16:30"
                  },
                  {
                    "day": "TUESDAY",
                    "startTime": "18:30",
                    "endTime": "20:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "TUT",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "08:30",
                    "endTime": "09:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "14:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "14:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "ECE 3336B",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "14:30",
                    "endTime": "15:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "11:30",
                    "endTime": "13:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "TUT",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "17:30",
                    "endTime": "18:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "ECE 3370B",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "11:30",
                    "endTime": "13:30"
                  },
                  {
                    "day": "THURSDAY",
                    "startTime": "13:30",
                    "endTime": "14:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "TUT",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "17:30",
                    "endTime": "18:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "ECE 3375B",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "08:30",
                    "endTime": "10:30"
                  },
                  {
                    "day": "WEDNESDAY",
                    "startTime": "15:30",
                    "endTime": "16:30"
                  }
                ]
              },
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "12:30",
                    "endTime": "14:30"
                  },
                  {
                    "day": "THURSDAY",
                    "startTime": "14:30",
                    "endTime": "15:30"
                  }
                ]
              },
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "09:30",
                    "endTime": "11:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "10:30",
                    "endTime": "13:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "10:30",
                    "endTime": "13:30"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "008",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "009",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "010",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "11:30",
                    "endTime": "14:30"
                  }
                ]
              },
              {
                "id": "011",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "11:30",
                    "endTime": "14:30"
                  }
                ]
              },
              {
                "id": "012",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "013",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "014",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "015",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "ECE 3399B",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "13:30",
                    "endTime": "14:30"
                  }
                ]
              },
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "13:30",
                    "endTime": "14:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      }
    ],
    "rules": defaultRules()
  }
},
{
  "label": "MSE Year 3 - Semester 1",
  "request": {
    "topN": 10,
    "courses": [
      {
        "code": "ECE 2277A",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "13:30",
                    "endTime": "14:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "15:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "13:30",
                    "endTime": "15:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "14:30",
                    "endTime": "15:30"
                  }
                ]
              },
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "17:30",
                    "endTime": "18:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "15:30",
                    "endTime": "17:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "TUT",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "17:30",
                    "endTime": "18:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "16:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "20:30",
                    "endTime": "21:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "008",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "009",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "010",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "011",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "13:30",
                    "endTime": "16:30"
                  }
                ]
              },
              {
                "id": "012",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "13:30",
                    "endTime": "16:30"
                  }
                ]
              },
              {
                "id": "013",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "14:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "014",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "14:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "015",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "016",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "017",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "018",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "019",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "020",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "021",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "ECE 3330A",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "18:30",
                    "endTime": "20:30"
                  },
                  {
                    "day": "THURSDAY",
                    "startTime": "14:30",
                    "endTime": "15:30"
                  }
                ]
              },
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  },
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "20:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "14:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "14:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "09:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "15:30",
                    "endTime": "18:30"
                  }
                ]
              },
              {
                "id": "008",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "15:30",
                    "endTime": "18:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "MME 3381A",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "12:30",
                    "endTime": "13:30"
                  },
                  {
                    "day": "TUESDAY",
                    "startTime": "16:30",
                    "endTime": "17:30"
                  },
                  {
                    "day": "THURSDAY",
                    "startTime": "08:30",
                    "endTime": "09:30"
                  }
                ]
              },
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "12:30",
                    "endTime": "13:30"
                  },
                  {
                    "day": "TUESDAY",
                    "startTime": "16:30",
                    "endTime": "17:30"
                  },
                  {
                    "day": "THURSDAY",
                    "startTime": "08:30",
                    "endTime": "09:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "TUT",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "14:30",
                    "endTime": "16:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "14:30",
                    "endTime": "16:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "15:30",
                    "endTime": "18:30"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "14:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "008",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "009",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "010",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "011",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "13:30",
                    "endTime": "16:30"
                  }
                ]
              },
              {
                "id": "012",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "13:30",
                    "endTime": "16:30"
                  }
                ]
              },
              {
                "id": "013",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "11:30",
                    "endTime": "14:30"
                  }
                ]
              },
              {
                "id": "014",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "MSE 3301A",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "12:30",
                    "endTime": "13:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "09:30",
                    "endTime": "11:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "MSE 3310A",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  },
                  {
                    "day": "TUESDAY",
                    "startTime": "13:30",
                    "endTime": "14:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "08:30",
                    "endTime": "09:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "11:30",
                    "endTime": "14:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      }
    ],
    "rules": defaultRules()
  }
},
{
  "label": "MSE Year 3 - Semester 2",
  "request": {
    "topN": 10,
    "courses": [
      {
        "code": "ECE 3331B",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "10:30",
                    "endTime": "11:30"
                  },
                  {
                    "day": "THURSDAY",
                    "startTime": "10:30",
                    "endTime": "12:30"
                  }
                ]
              },
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  },
                  {
                    "day": "WEDNESDAY",
                    "startTime": "13:30",
                    "endTime": "15:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "11:30",
                    "endTime": "14:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "11:30",
                    "endTime": "14:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "13:30",
                    "endTime": "16:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "ECE 3375B",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "08:30",
                    "endTime": "10:30"
                  },
                  {
                    "day": "WEDNESDAY",
                    "startTime": "15:30",
                    "endTime": "16:30"
                  }
                ]
              },
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "12:30",
                    "endTime": "14:30"
                  },
                  {
                    "day": "THURSDAY",
                    "startTime": "14:30",
                    "endTime": "15:30"
                  }
                ]
              },
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "09:30",
                    "endTime": "11:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "10:30",
                    "endTime": "13:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "10:30",
                    "endTime": "13:30"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "008",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "009",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "010",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "11:30",
                    "endTime": "14:30"
                  }
                ]
              },
              {
                "id": "011",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "11:30",
                    "endTime": "14:30"
                  }
                ]
              },
              {
                "id": "012",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "013",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "014",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "015",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "08:30",
                    "endTime": "11:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "MME 3360B",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "15:30",
                    "endTime": "16:30"
                  },
                  {
                    "day": "WEDNESDAY",
                    "startTime": "17:30",
                    "endTime": "18:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "11:30",
                    "endTime": "12:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "TUT",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "09:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "13:30",
                    "endTime": "15:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "15:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "09:30",
                    "endTime": "11:30"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "20:30"
                  }
                ]
              },
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "TUESDAY",
                    "startTime": "17:30",
                    "endTime": "19:30"
                  }
                ]
              },
              {
                "id": "008",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "19:00",
                    "endTime": "21:00"
                  }
                ]
              },
              {
                "id": "009",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "16:30",
                    "endTime": "18:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "MME 3380B",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "14:30",
                    "endTime": "15:30"
                  },
                  {
                    "day": "WEDNESDAY",
                    "startTime": "10:30",
                    "endTime": "11:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "14:30",
                    "endTime": "15:30"
                  }
                ]
              },
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "14:30",
                    "endTime": "15:30"
                  },
                  {
                    "day": "WEDNESDAY",
                    "startTime": "10:30",
                    "endTime": "11:30"
                  },
                  {
                    "day": "FRIDAY",
                    "startTime": "14:30",
                    "endTime": "15:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "14:30",
                    "endTime": "17:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "18:00",
                    "endTime": "21:00"
                  }
                ]
              },
              {
                "id": "006",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "15:30",
                    "endTime": "18:30"
                  }
                ]
              },
              {
                "id": "007",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "18:30",
                    "endTime": "21:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      },
      {
        "code": "MSE 3302B",
        "components": [
          {
            "type": "LEC",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "001",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "08:30",
                    "endTime": "10:30"
                  },
                  {
                    "day": "THURSDAY",
                    "startTime": "08:30",
                    "endTime": "09:30"
                  }
                ]
              }
            ]
          },
          {
            "type": "LAB",
            "enrollmentRequirement": "REQUIRED",
            "attendanceRequirement": "MANDATORY",
            "meetingFrequency": "WEEKLY",
            "included": true,
            "sections": [
              {
                "id": "002",
                "meetings": [
                  {
                    "day": "THURSDAY",
                    "startTime": "18:00",
                    "endTime": "21:00"
                  }
                ]
              },
              {
                "id": "003",
                "meetings": [
                  {
                    "day": "FRIDAY",
                    "startTime": "15:30",
                    "endTime": "18:30"
                  }
                ]
              },
              {
                "id": "004",
                "meetings": [
                  {
                    "day": "WEDNESDAY",
                    "startTime": "13:30",
                    "endTime": "16:30"
                  }
                ]
              },
              {
                "id": "005",
                "meetings": [
                  {
                    "day": "MONDAY",
                    "startTime": "10:30",
                    "endTime": "13:30"
                  }
                ]
              }
            ]
          }
        ],
        "compatibilities": []
      }
    ],
    "rules": defaultRules()
  }
}
];

export const PRESETS: Preset[] = [{
  label: "SE Year 3",
  workspace: {
    activeSemester: "SEMESTER_1",
    topN: 10,
    rules: defaultRules(),
    semesters: {
      SEMESTER_1: { courses: SEMESTER_PRESETS.find((preset) => preset.label === "SE Year 3 - Semester 1")!.request.courses },
      SEMESTER_2: { courses: SEMESTER_PRESETS.find((preset) => preset.label === "SE Year 3 - Semester 2")!.request.courses }
    }
  }
},
{
  label: "SE Year 3 w/electives",
  workspace: {
    activeSemester: "SEMESTER_1",
    topN: 10,
    rules: defaultRules(),
    semesters: {
      SEMESTER_1: { courses: SEMESTER_PRESETS.find((preset) => preset.label === "SE Year 3 - Semester 1")!.request.courses },
      SEMESTER_2: { courses: SEMESTER_PRESETS.find((preset) => preset.label === "SE Year 3 w/electives - Semester 2")!.request.courses },
    }
  }
},
{
  label: "EE Year 3",
  workspace: {
    activeSemester: "SEMESTER_1",
    topN: 10,
    rules: defaultRules(),
    semesters: {
      SEMESTER_1: { courses: SEMESTER_PRESETS.find((preset) => preset.label === "EE Year 3 - Semester 1")!.request.courses },
      SEMESTER_2: { "courses": SEMESTER_PRESETS.find((preset) => preset.label === "EE Year 3 - Semester 2")!.request.courses }
    }
  }
},
{
  label: "MSE Year 3",
  workspace: {
    activeSemester: "SEMESTER_1",
    topN: 10,
    rules: defaultRules(),
    semesters: {
      SEMESTER_1: { "courses": SEMESTER_PRESETS.find((preset) => preset.label === "MSE Year 3 - Semester 1")!.request.courses },
      SEMESTER_2: { "courses": SEMESTER_PRESETS.find((preset) => preset.label === "MSE Year 3 - Semester 2")!.request.courses }
    }
  }
}
];



