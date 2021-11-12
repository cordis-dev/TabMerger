import React from "react";
import styled from "styled-components";
import { useSelector } from "../../hooks/useSelector";
import { Scrollbar } from "../../styles/Scrollbar";
import Information from "./Information";
import SearchResult from "../SearchResult";
import Window from "./Window";
import { Draggable, Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`;

const WindowContainer = styled(Scrollbar)<{ $searching: boolean; $draggedOver: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
  height: ${({ $searching }) => ($searching ? "412px" : "460px")};
  border: 1px dashed ${({ $draggedOver }) => ($draggedOver ? "blue" : "transparent")};
`;

export default function Windows(): JSX.Element {
  const { typing, filterChoice } = useSelector((state) => state.header);
  const { filteredTabs } = useSelector((state) => state.filter);
  const { active, available } = useSelector((state) => state.groups);
  const { type: dragType } = useSelector((state) => state.dnd);
  const { index } = active;
  const { windows, info, name, updatedAt } = available[index];

  const hasMoreThanOneFilteredTab = typing ? filteredTabs.some((item) => item.length > 0) : true;

  return (
    <Container>
      <Information info={info} name={name} updatedAt={updatedAt} index={index} />

      {typing && filterChoice === "tab" && <SearchResult type="tab" />}

      <Droppable droppableId={"group-" + index} isDropDisabled={dragType.includes("tab")}>
        {(provider, dropSnapshot) => (
          <WindowContainer
            ref={provider.innerRef}
            {...provider.droppableProps}
            $searching={typing}
            $draggedOver={dropSnapshot.isDraggingOver}
          >
            {hasMoreThanOneFilteredTab &&
              windows.map((window, i) => (
                <Draggable key={i} draggableId={`window-${i}-group-${index}`} index={i}>
                  {(provided, dragSnapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <Window
                        {...window}
                        index={i}
                        snapshot={dragSnapshot}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}

            {provider.placeholder}
          </WindowContainer>
        )}
      </Droppable>
    </Container>
  );
}
