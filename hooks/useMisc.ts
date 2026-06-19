import { useQuery } from "@tanstack/react-query";
import {
  fetchAudit,
  fetchDbGroups,
  fetchDeployLog,
  fetchDeployPipeline,
  fetchDomains,
  fetchEmailAccounts,
  fetchFiles,
  fetchLogLines,
  fetchSettings,
  fetchSsl,
  fetchTeam,
} from "@/lib/api";

export const useDomains = () => useQuery({ queryKey: ["domains"], queryFn: fetchDomains });
export const useSsl = () => useQuery({ queryKey: ["ssl"], queryFn: fetchSsl });
export const useDbGroups = () => useQuery({ queryKey: ["db-groups"], queryFn: fetchDbGroups });
export const useFiles = () => useQuery({ queryKey: ["files"], queryFn: fetchFiles });
export const useEmailAccounts = () =>
  useQuery({ queryKey: ["email-accounts"], queryFn: fetchEmailAccounts });
export const useTeam = () => useQuery({ queryKey: ["team"], queryFn: fetchTeam });
export const useAudit = () => useQuery({ queryKey: ["audit"], queryFn: fetchAudit });
export const useDeployLog = () => useQuery({ queryKey: ["deploy-log"], queryFn: fetchDeployLog });
export const useDeployPipeline = () =>
  useQuery({ queryKey: ["deploy-pipeline"], queryFn: fetchDeployPipeline });
export const useLogLines = () => useQuery({ queryKey: ["log-lines"], queryFn: fetchLogLines });
export const useSettingsData = () => useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
