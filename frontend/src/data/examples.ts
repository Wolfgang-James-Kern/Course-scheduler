import type {SolveRequest} from "../types";

export type Preset = {
    label: string;
    request: SolveRequest;
};

export const PRESETS: Preset[] = [
    {
        label: "SE 2nd year 1st sem",
        request: {
            "topN": 10,
            "constraints": {
                "earliestStart": "09:00",
                "latestEnd": "18:00",
                "maxGapMinutes": 120
            },
            "courses": [
                {
                "code": "2141-TUT",
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
                },
                {
                "code": "2141-LEC",
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
                "code": "2151-LEC",
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
                        "day": "WEDNESDAY",
                        "startTime": "12:30",
                        "endTime": "13:30"
                        },
                        {
                        "day": "TUESDAY",
                        "startTime": "08:30",
                        "endTime": "09:30"
                        }
                    ]
                    }
                ]
                },
                {
                "code": "2205-LAB",
                "sections": [
                    {
                    "id": "003",
                    "meetings": [
                        {
                        "day": "FRIDAY",
                        "startTime": "15:30",
                        "endTime": "17:30"
                        }
                    ]
                    },
                    {
                    "id": "004",
                    "meetings": [
                        {
                        "day": "FRIDAY",
                        "startTime": "09:30",
                        "endTime": "11:30"
                        }
                    ]
                    },
                    {
                    "id": "005",
                    "meetings": [
                        {
                        "day": "WEDNESDAY",
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
                        "startTime": "15:30",
                        "endTime": "17:30"
                        }
                    ]
                    }
                ]
                },
                {
                "code": "2205-LEC",
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
                        "day": "THURSDAY",
                        "startTime": "17:30",
                        "endTime": "18:30"
                        }
                    ]
                    },
                    {
                    "id": "002",
                    "meetings": [
                        {
                        "day": "MONDAY",
                        "startTime": "09:30",
                        "endTime": "10:30"
                        },
                        {
                        "day": "TUESDAY",
                        "startTime": "17:30",
                        "endTime": "18:30"
                        },
                        {
                        "day": "WEDNESDAY",
                        "startTime": "10:30",
                        "endTime": "11:30"
                        }
                    ]
                    }
                ]
                },
                {
                "code": "2202-TUT",
                "sections": [
                    {
                    "id": "003",
                    "meetings": [
                        {
                        "day": "TUESDAY",
                        "startTime": "11:30",
                        "endTime": "13:30"
                        }
                    ]
                    },
                    {
                    "id": "004",
                    "meetings": [
                        {
                        "day": "TUESDAY",
                        "startTime": "09:30",
                        "endTime": "11:30"
                        }
                    ]
                    }
                ]
                },
                {
                "code": "2202-LEC",
                "sections": [
                    {
                    "id": "001",
                    "meetings": [
                        {
                        "day": "TUESDAY",
                        "startTime": "14:30",
                        "endTime": "16:30"
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
                        "day": "MONDAY",
                        "startTime": "14:30",
                        "endTime": "16:30"
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
                "code": "2277-LAB",
                "sections": [
                    {
                    "id": "007/008",
                    "meetings": [
                        {
                        "day": "TUESDAY",
                        "startTime": "18:30",
                        "endTime": "21:30"
                        }
                    ]
                    },
                    {
                    "id": "009/010",
                    "meetings": [
                        {
                        "day": "FRIDAY",
                        "startTime": "09:30",
                        "endTime": "12:30"
                        }
                    ]
                    },
                    {
                    "id": "011/012",
                    "meetings": [
                        {
                        "day": "MONDAY",
                        "startTime": "13:30",
                        "endTime": "16:30"
                        }
                    ]
                    },
                    {
                    "id": "013/014",
                    "meetings": [
                        {
                        "day": "THURSDAY",
                        "startTime": "15:30",
                        "endTime": "18:30"
                        }
                    ]
                    },
                    {
                    "id": "015/016",
                    "meetings": [
                        {
                        "day": "WEDNESDAY",
                        "startTime": "18:30",
                        "endTime": "21:30"
                        }
                    ]
                    },
                    {
                    "id": "017/018",
                    "meetings": [
                        {
                        "day": "TUESDAY",
                        "startTime": "08:30",
                        "endTime": "11:30"
                        }
                    ]
                    },
                    {
                    "id": "019/20",
                    "meetings": [
                        {
                        "day": "WEDNESDAY",
                        "startTime": "14:30",
                        "endTime": "17:30"
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
                },
                {
                "code": "2277-TUT",
                "sections": [
                    {
                    "id": "004",
                    "meetings": [
                        {
                        "day": "THURSDAY",
                        "startTime": "08:30",
                        "endTime": "09:30"
                        }
                    ]
                    },
                    {
                    "id": "005",
                    "meetings": [
                        {
                        "day": "WEDNESDAY",
                        "startTime": "17:30",
                        "endTime": "18:30"
                        }
                    ]
                    },
                    {
                    "id": "006",
                    "meetings": [
                        {
                        "day": "WEDNESDAY",
                        "startTime": "10:30",
                        "endTime": "11:30"
                        }
                    ]
                    }
                ]
                },
                {
                "code": "2277-LEC",
                "sections": [
                    {
                    "id": "001",
                    "meetings": [
                        {
                        "day": "WEDNESDAY",
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
                        "day": "MONDAY",
                        "startTime": "16:30",
                        "endTime": "18:30"
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
                        "day": "THURSDAY",
                        "startTime": "18:30",
                        "endTime": "19:30"
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
                "code": "2270-LEC",
                "sections": [
                    {
                    "id": "001",
                    "meetings": [
                        {
                        "day": "MONDAY",
                        "startTime": "08:30",
                        "endTime": "09:30"
                        },
                        {
                        "day": "WEDNESDAY",
                        "startTime": "08:30",
                        "endTime": "09:30"
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
                "code": "2270-TUT",
                "sections": [
                    {
                    "id": "003",
                    "meetings": [
                        {
                        "day": "FRIDAY",
                        "startTime": "15:30",
                        "endTime": "16:30"
                        }
                    ]
                    },
                    {
                    "id": "004",
                    "meetings": [
                        {
                        "day": "FRIDAY",
                        "startTime": "12:30",
                        "endTime": "13:30"
                        }
                    ]
                    },
                    {
                    "id": "006",
                    "meetings": [
                        {
                        "day": "FRIDAY",
                        "startTime": "10:30",
                        "endTime": "11:30"
                        }
                    ]
                    },
                    {
                    "id": "008",
                    "meetings": [
                        {
                        "day": "MONDAY",
                        "startTime": "11:30",
                        "endTime": "12:30"
                        }
                    ]
                    },
                    {
                    "id": "009",
                    "meetings": [
                        {
                        "day": "MONDAY",
                        "startTime": "10:30",
                        "endTime": "11:30"
                        }
                    ]
                    },
                    {
                    "id": "011",
                    "meetings": [
                        {
                        "day": "MONDAY",
                        "startTime": "11:30",
                        "endTime": "12:30"
                        }
                    ]
                    },
                    {
                    "id": "012",
                    "meetings": [
                        {
                        "day": "FRIDAY",
                        "startTime": "10:30",
                        "endTime": "11:30"
                        }
                    ]
                    }
                ]
                }
            ]
        }
    }
];
