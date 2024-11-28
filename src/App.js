import { useEffect, useState } from "react";
import Gantt from "./components/Gantt";
import { task } from "./dataNew.js";
import Toolbar from "./components/Toolbar";
import "./styles.css";
import SidePanel from "./components/Side Panel/sidePanel.js";
import Checkbox from "antd/lib/checkbox/Checkbox.js";

export const formattedDate = (date) => {
  if (date !== null) {
    let formattedDate = new Date(date);
    return `${String(formattedDate.getDate()).padStart(2, "0")}-${String(
      formattedDate.getMonth() + 1
    ).padStart(2, "0")}-${formattedDate.getFullYear()}`;
  } else return null;
};

function App() {
  const [currentZoom, setZoom] = useState("Quarter");
  const [tasks, setTasks] = useState({ data: [], links: [] });
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const createGanttData = (respObj) => {
    let data = [];
    let index = 0;
    const uniqueIds = new Set();

    const vendors = respObj.vendors;
    const submittals = respObj.submittals.sort((a, b) =>
      a.text.localeCompare(b.text)
    );
    const materials = respObj.materials.sort((a, b) =>
      a.text.localeCompare(b.text)
    );
    const links = respObj.links;

    const childMap = new Map();
    links.forEach((link) => {
      const sourceId = link.source;
      const targetId = link.target;

      if (!childMap.has(sourceId)) {
        childMap.set(sourceId, []);
      }
      childMap.get(sourceId).push(targetId);
    });

    vendors.forEach((vendor) => {
      let leastStartDate = new Date("9999-12-31");

      // Filter submittals related to this vendor
      const vendorSubmittals = submittals.filter(
        (submittal) => submittal.parent === vendor.id
      );

      vendorSubmittals.forEach((submittal) => {
        // Check if this submittal's start date is the earliest for the vendor
        const submittalStartDate = new Date(submittal.start_date);
        if (submittal.start_date && submittalStartDate < leastStartDate) {
          leastStartDate = submittalStartDate;
        }

        if (!uniqueIds.has(submittal.id)) {
          uniqueIds.add(submittal.id);
          const submittalNode = {
            id: submittal.id,
            text: submittal.text,
            start_date: formattedDate(submittal.start_date),
            end_date: formattedDate(submittal.end_date),
            parent: vendor.id,
            type: submittal.type,
            risk_level: submittal.risk_level,
            risk_assessment: submittal.risk_assessment,
            render: "split",
            open: false,
          };
          data.push(submittalNode);

          submittal.milestones.forEach((milestone) => {
            const milestoneNode = {
              id: index + 1,
              text: milestone.name_milestone,
              start_date: formattedDate(milestone.start_date),
              end_date: formattedDate(milestone.end_date),
              parent: milestone.parent,
              type: milestone.type,
              risk_level: milestone.current_step ? "HIGH" : "LOW",
              risk_assessment: milestone.current_step
                ? submittalNode.risk_assessment
                : "NONE",
              ...(milestone.current_step ? { rollUp: true } : null),
            };
            index++;
            data.push(milestoneNode);
          });
        }

        // Find materials linked to this submittal using childMap
        const linkedMaterialIds = childMap.get(submittal.id) || [];
        linkedMaterialIds.forEach((materialId) => {
          const material = materials.find((mat) => mat.id === materialId);

          const materialStartDate = new Date(material?.start_date);
          if (material?.start_date && materialStartDate < leastStartDate) {
            leastStartDate = materialStartDate;
          }

          if (material && !uniqueIds.has(material.id)) {
            uniqueIds.add(material.id);
            // Add material node immediately after the submittal if it's unique
            const materialNode = {
              id: material.id,
              text: material.text,
              start_date: formattedDate(material.start_date),
              end_date: formattedDate(material.end_date),
              parent: vendor.id,
              type: material.type,
              risk_level: material.risk_level,
              risk_assessment: submittal.risk_assessment,
              activity_count: material.activity_count,
              render: "split",
              open: false,
            };
            data.push(materialNode);

            material.milestones.forEach((milestone) => {
              const milestoneNode = {
                id: index + 1,
                text: milestone.name_milestone,
                start_date: formattedDate(milestone.start_date),
                end_date: formattedDate(milestone.end_date),
                parent: milestone.parent,
                type: milestone.type,
                risk_level: milestone.current_step ? "HIGH" : "LOW",
                risk_assessment: milestone.current_step
                  ? materialNode.risk_assessment
                  : "NONE",
                ...(milestone.current_step ? { rollUp: true } : null),
              };
              index++;
              data.push(milestoneNode);
            });
          }
        });
      });

      const vendorStartDate =
        leastStartDate < new Date("9999-12-31")
          ? formattedDate(leastStartDate)
          : null;
      const vendorNode = {
        id: vendor.id,
        text: vendor.text,
        start_date: vendorStartDate,
        type: vendor.type,
        risk_level: "",
      };
      data.push(vendorNode);
    });

    let tasks = {
      data: data,
      links: respObj.links,
    };
    console.log(tasks);
    setTasks(tasks);
  };

  useEffect(() => {
    fetch(
      "http://54.227.202.17:4000/procurement-schedule/3dbcff1f-a0e4-4838-a84c-d828f4a3a79c"
    )
      .then((response) => response.json())
      .then((data) => createGanttData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <div className="zoom-bar">
        <Toolbar zoom={currentZoom} setZoom={setZoom} />
        <div style={{ paddingLeft: "20px" }}>
          <label>Risk Level:</label>
          <Checkbox className="filterCheckbox" name="HIGH">
            High
          </Checkbox>
          <Checkbox className="filterCheckbox" name="LOW">
            Low
          </Checkbox>
        </div>
      </div>
      <div className={isOpen ? "gantt-container-squeezed" : "gantt-container"}>
        {tasks.data.length > 0 ? (
          <>
            <Gantt tasks={tasks} zoom={currentZoom} togglePanel={togglePanel} />
            <SidePanel isOpen={isOpen} togglePanel={togglePanel} />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
