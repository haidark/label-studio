import { API } from "apps/labelstudio/src/providers/ApiProvider";

export type APIProject = {
  id: number;
  title: string;
  description?: string;
  label_config?: string;
  parsed_label_config?: any;
  [key: string]: any;
};

export const importFiles = async ({
  files,
  body,
  project,
  onUploadStart,
  onUploadFinish,
  onFinish,
  onError,
  dontCommitToProject,
}: {
  files: { name: string }[];
  body: Record<string, any> | FormData;
  project: APIProject;
  onUploadStart?: (files: { name: string }[]) => void;
  onUploadFinish?: (files: { name: string }[]) => void;
  onFinish?: (response: any) => void;
  onError?: (response: any) => void;
  dontCommitToProject?: boolean;
}) => {
  onUploadStart?.(files);

  const query = dontCommitToProject ? { commit_to_project: "false" } : {};

  const contentType =
    body instanceof FormData
      ? "multipart/form-data" // usual multipart for usual files
      : "application/x-www-form-urlencoded"; // chad urlencoded for URL uploads
  const res = await API.invoke(
    "importFiles",
    { pk: project.id, ...query },
    { headers: { "Content-Type": contentType }, body },
  );

  if (res && !res.error) onFinish?.(res);
  else onError?.(res?.response);

  onUploadFinish?.(files);
};

export const createEmptyTasks = async ({
  count,
  project,
  onStart,
  onFinish,
  onError,
}: {
  count: number;
  project: APIProject;
  onStart?: () => void;
  onFinish?: (response: any) => void;
  onError?: (response: any) => void;
}) => {
  onStart?.();

  try {
    const res = await API.invoke(
      "createEmptyTasks",
      { pk: project.id },
      { 
        headers: { "Content-Type": "application/json" }, 
        body: { count } 
      },
    );

    if (res && !res.error) {
      onFinish?.(res);
    } else {
      onError?.(res?.response);
    }
  } catch (error) {
    onError?.(error);
  }
};
