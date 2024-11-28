export function getData() {
  const tasks = {
    data: [
      {
        id: "10",
        text: "Subcontractor1",
        start_date: "01-04-2025",
        open: false,
        type: "V",
        risk_level: ""
      },
      {
        id: "1",
        text: "Submittal1",
        start_date: "01-04-2025",
        end_date: "10-04-2025",
        parent: "10",
        type: "S",
        risk_level: "H"
      },
      {
        id: "2",
        text: "Material1",
        start_date: "11-04-2025",
        start_date: "14-04-2025",
        parent: "10",
        type: "M",
        risk_level: ""
      },
      {
        id: "3",
        text: "Material2",
        start_date: "15-04-2025",
        end_date: "18-04-2025",
        parent: "10",
        type: "M",
        risk_level: ""
      },
      {
        id: "12",
        text: "Submittal3",
        start_date: "07-04-2025",
        end_date: "15-04-2025",
        parent: "10",
        type: "S",
        risk_level: ""
      },
      {
        id: "20",
        text: "Subcontractor2",
        start_date: "01-04-2025",
        open: true,
        type: "V",
        risk_level: ""
      },
      {
        id: "4",
        text: "Submittal2",
        start_date: "01-04-2025",
        end_date: "10-04-2025",
        parent: "20",
        type: "S",
        render:"split",
        risk_level: "H"
      },
      {
        id: "7",
        text: "SC Submittal Prep",
        start_date: "01-04-2025",
        end_date: "03-04-2025",
        parent: "4",
        type: "SS",
        risk_level: "",
        rollup: false
      },
      {
        id: "8",
        text: "GC Review",
        start_date: "03-04-2025",
        end_date: "05-04-2025",
        parent: "4",
        type: "SS",
        risk_level: "H",
        rollup: true
      },
      {
        id: "9",
        text: "Design Review",
        start_date: "05-04-2025",
        end_date: "07-04-2025",
        parent: "4",
        type: "SS",
        risk_level: "",
        rollup: false
      },
      {
        id: "11",
        text: "Final GC Review",
        start_date: "07-04-2025",
        end_date: "10-04-2025",
        parent: "4",
        type: "SS",
        risk_level: "",
        rollup: false
      },
      {
        id: "5",
        text: "Material3",
        start_date: "11-04-2025",
        start_date: "14-04-2025",
        parent: "20",
        type: "M",
        risk_level: ""
      },
      {
        id: "6",
        text: "Material4",
        start_date: "15-04-2025",
        end_date: "18-04-2025",
        parent: "20",
        type: "M",
        risk_level: ""
      },
      {
        id: "13",
        text: "Submittal4",
        start_date: null,
        end_date: null,
        parent: "10",
        type: "S",
        render:"",
        risk_level: ""
      },
      {
        id: "14",
        text: "Material5",
        start_date: "15-04-2025",
        end_date: "18-04-2025",
        parent: "10",
        type: "M",
        risk_level: ""
      }
    ],
    links: [
      { source: 1, target: 2, type: "0" },
      { source: 1, target: 3, type: "0" },
      { source: 4, target: 5, type: "0" },
      { source: 4, target: 6, type: "0" },
      { source: 12, target: 3, type: "0" },
    ],
  };

  return tasks;
}
