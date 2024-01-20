import { useCallback } from "react";
import { ReactTags, Tag } from "react-tag-autocomplete";
import { User } from "./Account";

type TagSelectorProps = {
  user: User;
  tags: Tag[];
  setTags: React.Dispatch<Tag[]>;
  suggestions: Tag[];
  setSuggestions: React.Dispatch<Tag[]>;
};

const TagSelector = ({
  user,
  tags,
  setTags,
  suggestions,
  setSuggestions,
}: TagSelectorProps) => {
  const onAdd = useCallback(
    (newTag: Tag) => {
      setTags([...tags, newTag]);
      // If the newly added tag was not already in the suggestions array, add it
      // so that the tag appears in the dropdown list along with the other tags
      if (!suggestions.map((tag) => tag.label).includes(newTag.label))
        suggestions.push(newTag);
    },
    [tags]
  );

  const onDelete = useCallback(
    (tagIndex: number) => {
      setTags(tags.filter((_, i) => i !== tagIndex));
      // If the tag that was deleted was not an existing tag (i.e., not saved
      // to user.tags), then remove it from the suggestions array.
      const tagLabel = tags[tagIndex].label;
      if (!user.tags.includes(tagLabel)) {
        setSuggestions(suggestions.filter((tag) => tag.label !== tagLabel));
      }
    },
    [tags]
  );

  return (
    <ReactTags
      selected={tags}
      suggestions={suggestions}
      onAdd={onAdd}
      onDelete={onDelete}
      placeholderText="Tags (optional)"
      allowNew
      allowBackspace={false}
      newOptionText="Create new tag: %value%"
    />
  );
};

export default TagSelector;
