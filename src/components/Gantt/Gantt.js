import { useEffect, useRef } from "react";
import { Gantt } from "@dhx/trial-gantt";
import "@dhx/trial-gantt/codebase/dhtmlxgantt.css";
import { formattedDate } from "../../App";

export default function GanttView({ tasks, zoom, togglePanel }) {
  let container = useRef();

  const getTaskColor = (task) => {
    if (task.type !== "V" && task.risk_level?.toString() === "HIGH") {
      return "red";
    } else return "white";
  };

  useEffect(() => {
    let gantt = Gantt.getGanttInstance();
    gantt.skin = "broadway";
    gantt.config.readonly = true;
    gantt.plugins({
      tooltip: true,
    });
    gantt.config.tooltip_timeout = 500;
    gantt.config.columns = [
      {
        name: "",
        label: "",
        width: "",
        min_width: 25,
        max_width: 25,
        template(task) {
          const color = getTaskColor(task);
          return `<div style="background-color: ${color}; width: 100%; height: 100%; margin-left:-11px"></div>`;
        },
      },
      {
        name: "text",
        label: "",
        tree: true,
        width: "*",
        min_width: 400,
        max_width: 400,
        template(task) {
          if (task.type === "S")
            return `
          <div class="icon-text">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#9d9d9d">
              <path d="M200-200h560v-367L567-760H200v560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h400l240 240v400q0 33-23.5 56.5T760-120H200Zm80-160h400v-80H280v80Zm0-160h400v-80H280v80Zm0-160h280v-80H280v80Zm-80 400v-560 560Z"/>
            </svg>
            <label>${task.text}</label>
          </div>`;
          else if (task.type === "M")
            return `
          <div class="icon-text">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#9d9d9d">
              <path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z"/>
            </svg>
            <label>${task.text}</label>
          </div>`;
          else return task.text;
        },
      },
    ];

    window.addEventListener("click", function (e) {
      const filterCheckbox = e.target.closest(".filterCheckbox");
      if (filterCheckbox) {
        gantt.render();
      }
    });
    function filterLogic(id) {
      const filterCheckboxes = document.querySelectorAll(
        ".filterCheckbox input"
      );
      let applyFilter = false;
      let returnValue = false;

      for (let i = 0; i < filterCheckboxes.length; i++) {
        const filterCheckbox = filterCheckboxes[i];
        if (filterCheckbox.checked) {
          applyFilter = true;
          if (hasPriority(id, filterCheckbox.name)) {
            returnValue = true;
            break;
          }
        }
      }
      if (applyFilter) {
        return returnValue;
      }
      return true;
    }
    function hasPriority(parent, priority) {
      if (gantt.getTask(parent).risk_level == priority) {
        return true;
      }

      const child = gantt.getChildren(parent);
      for (let i = 0; i < child.length; i++) {
        if (hasPriority(child[i], priority)) {
          return true;
        }
      }
      return false;
    }
    gantt.attachEvent("onBeforeTaskDisplay", function (id, task) {
      return filterLogic(id);
    });

    gantt.attachEvent(
      "onBeforeRollupTaskDisplay",
      function (taskId, task, parentId) {
        if (
          (task.type?.toString() === "SS" || task.type?.toString() === "MS") &&
          task.risk_level?.toString() === "HIGH"
        )
          task.text = "";
        return true;
      }
    );

    function buttonHtml(action, count) {
      return `<div style="padding-left: 0px;display: flex;align-items: center;padding-top: 3px;">
              <div style="width: 15px; height: 1px; background-color: black;"></div>
              <span class='activity-box' data-action="${action}" name='${count}'/>
            </div>`;
    }
    gantt.templates.rightside_text = (start, end, task) => {
      if (task.type?.toString() === "M" && task.activity_count > 0) {
        return buttonHtml("openPanel", task.activity_count);
      }
      return "";
    };
    gantt.attachEvent("onGanttReady", function () {
      let tooltips = gantt.ext.tooltips;
      tooltips.tooltipFor({
        selector: ".activity-box",
        html: function (event, node) {
          const spanElement = document.querySelector(
            'span.activity-box[data-action="openPanel"]'
          );
          const actCount = spanElement.getAttribute("name");
          let activityText = actCount === "1" ? "activity" : "activities";
          return `${actCount + " " + activityText}`;
        },
      });
    });

    gantt.attachEvent("onTaskClick", function (id, e) {
      const actionButton = e.target.closest(".activity-box");
      if (actionButton) {
        const actionType = actionButton.getAttribute("data-action");
        if (actionType === "openPanel") {
          togglePanel();
        } else return true;
      }

      let timelineClick = gantt.utils.dom.closest(e.target, ".gantt_task_line");
      if (timelineClick) {
        // var task = gantt.getTask(id);
        // task.color = getRandomColor();
        // gantt.updateTask(id);
        togglePanel();
      }
      return true;
    });

    let linkTasks = {};

    gantt.attachEvent("onMouseMove", function (id, e) {
      let previousLinkTasks = linkTasks;
      let currentTask;
      linkTasks = {};
      if (id && e.target.closest(".gantt_task_line")) {
        currentTask = gantt.getTask(id);
        currentTask.$source.forEach((item) => {
          let taskId = gantt.getLink(item).target;
          linkTasks[taskId] = true;
        });
        currentTask.$target.forEach((item) => {
          let taskId = gantt.getLink(item).source;
          linkTasks[taskId] = true;
        });
      }

      for (let i in linkTasks) {
        gantt.refreshTask(i);
      }
      for (let i in previousLinkTasks) {
        gantt.refreshTask(i);
      }
    });

    gantt.templates.task_class = function (start, end, task) {
      if (linkTasks[task.id]) {
        return "gantt_task_background";
      }
      if (
        (task.type?.toString() === "SS" || task.type?.toString() === "MS") &&
        task.risk_level?.toString() === "HIGH"
      ) {
        return "risk_subSubmittal";
      }
      if (task.type?.toString() === "V") {
        return "vendor";
      }
      if (task.type?.toString() === "S") {
        return "submittal";
      }
      if (task.type?.toString() === "SS") {
        return "subSubmittal";
      }
      if (task.type?.toString() === "MS") {
        return "subMaterial";
      }
      if (task.type?.toString() === "M") {
        return "material";
      }

      return "";
    };
    gantt.templates.tooltip_text = function (start, end, task) {
      return (
        "<b>Task:</b> " +
        task.text +
        "<br/><b>Start Date:</b> " +
        formattedDate(task.start_date) +
        "<br/><b>End Date:</b> " +
        formattedDate(task.end_date) +
        "<br/><b>Risk Level:</b> " +
        (task.risk_level === null ? "NONE" : task.risk_level) +
        (task.risk_assessment !== ""
          ? "<br/><b>Risk Assessment:</b> " + task.risk_assessment
          : "")
      );
    };

    gantt.init(container.current);
    gantt.parse(tasks);

    function initZoom() {
      gantt.ext.zoom.init({
        levels: [
          {
            name: "Days",
            scale_height: 50,
            min_column_width: 80,
            scales: [{ unit: "day", step: 1, format: "%d %M" }],
          },
          {
            name: "Weeks",
            scale_height: 50,
            min_column_width: 50,
            scales: [
              {
                unit: "week",
                step: 1,
                format(date) {
                  const dateToStr = gantt.date.date_to_str("%d %M");
                  const endDate = gantt.date.add(date, -6, "day");
                  const weekNum = gantt.date.date_to_str("%W")(date);
                  return `#${weekNum}, ${dateToStr(date)} - ${dateToStr(
                    endDate
                  )}`;
                },
              },
              { unit: "day", step: 1, format: "%j %D" },
            ],
          },
          {
            name: "Months",
            scale_height: 50,
            min_column_width: 120,
            scales: [
              { unit: "month", format: "%F, %Y" },
              { unit: "week", format: "Week #%W" },
            ],
          },
          {
            name: "Quarter",
            scale_height: 50,
            min_column_width: 90,
            scales: [
              { unit: "month", step: 1, format: "%M" },
              {
                unit: "quarter",
                step: 1,
                format(date) {
                  const dateToStr = gantt.date.date_to_str("%M");
                  const endDate = gantt.date.add(
                    gantt.date.add(date, 3, "month"),
                    -1,
                    "day"
                  );
                  return `${dateToStr(date)} - ${dateToStr(endDate)}`;
                },
              },
            ],
          },
          {
            name: "Year",
            scale_height: 50,
            min_column_width: 30,
            scales: [{ unit: "year", step: 1, format: "%Y" }],
          },
        ],
      });
    }

    function setZoom(value) {
      if (!gantt.ext.zoom.getLevels()) {
        initZoom();
      }
      gantt.ext.zoom.setLevel(value);
    }

    setZoom(zoom);

    return () => {
      gantt.destructor();
      container.current.innerHTML = "";
    };
  }, [zoom]);

  return <div ref={container} style={{ width: "100%", height: "100%" }}></div>;
}
