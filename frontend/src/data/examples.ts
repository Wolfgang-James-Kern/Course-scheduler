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
    "label": "SE - Semester 1",
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
    "label": "SE - Semester 2",
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
    "label": "SE (w/o physics w/electives) - Semester 1",
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
              ],
              "meetingFrequency": "WEEKLY"
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
              ],
              "meetingFrequency": "WEEKLY"
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
                      "day": "FRIDAY",
                      "startTime": "12:30",
                      "endTime": "14:30"
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
                      "day": "MONDAY",
                      "startTime": "15:30",
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
              ],
              "meetingFrequency": "WEEKLY"
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
              ],
              "meetingFrequency": "WEEKLY"
            }
          ],
          "compatibilities": []
        }
      ],
      "rules": defaultRules()
    }
  },
  {
    "label": "SE (w/o physics w/electives) - Semester 2",
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
  }
];

export const PRESETS: Preset[] = [{
  label: "SE Year 3",
  workspace: {
    activeSemester: "SEMESTER_1",
    topN: 10,
    rules: defaultRules(),
    semesters: {
      SEMESTER_1: { courses: SEMESTER_PRESETS[0].request.courses },
      SEMESTER_2: { courses: SEMESTER_PRESETS[1].request.courses },
    },
  },
},
{
  label: "SE Year 3 w/o physics w/electives",
  workspace: {
    activeSemester: "SEMESTER_1",
    topN: 10,
    rules: defaultRules(),
    semesters: {
      SEMESTER_1: { courses: SEMESTER_PRESETS[2].request.courses },
      SEMESTER_2: { courses: SEMESTER_PRESETS[3].request.courses },
    },
  },
}];



