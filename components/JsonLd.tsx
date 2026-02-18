import React from "react";

type JsonLdProps = {
  data: Record<string, any> | Array<Record<string, any>>;
};

const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;
