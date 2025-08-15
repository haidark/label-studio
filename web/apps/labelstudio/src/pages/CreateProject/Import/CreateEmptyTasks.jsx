import React, { useState, useCallback } from "react";
import { Button } from "@humansignal/ui";
import { IconPlus } from "@humansignal/icons";
import { useAPI } from "../../../providers/ApiProvider";
import Input from "libs/datamanager/src/components/Common/Input/Input";

export const CreateEmptyTasks = ({ project, onSuccess, onError }) => {
  const [count, setCount] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const api = useAPI();

  // Early return if project is not available
  if (!project || !project.id) {
    return <div>Project not available</div>;
  }

  const handleCreate = useCallback(async () => {
    if (count < 1 || count > 10000) {
      onError?.("Count must be between 1 and 10000");
      return;
    }

    setIsCreating(true);
    
    try {
      const response = await api.callApi("createEmptyTasks", {
        params: { pk: project.id },
        body: { count },
      });

      if (response && !response.error) {
        onSuccess?.(response);
        setCount(1);
      } else {
        onError?.(response?.response || response?.error);
      }
    } catch (error) {
      onError?.(error);
    } finally {
      setIsCreating(false);
    }
  }, [count, project, onSuccess, onError, api]);

  const handleCountChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 10000) {
      setCount(value);
    } else if (e.target.value === '') {
      setCount(1);
    }
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  }, [handleCreate]);

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min="1"
        max="10000"
        value={count}
        onChange={handleCountChange}
        onKeyPress={handleKeyPress}
        placeholder="Number of tasks"
        size="small"
        disabled={isCreating}
        aria-label="Number of empty tasks to create"
      />
      <Button
        variant="primary"
        look="outlined"
        onClick={handleCreate}
        disabled={isCreating || count < 1 || count > 10000}
        leading={<IconPlus />}
        aria-label="Create empty tasks"
        waiting={isCreating}
      >
        Create
      </Button>
    </div>
  );
};
