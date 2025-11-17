import Section from "../../components/ui/Section.tsx";

export {
  default,
  loader,
} from "../../components/search/SearchResult/SearchResult.tsx";

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
