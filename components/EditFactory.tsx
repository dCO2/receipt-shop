"use client"

import { ReceiptFactory } from "@prisma/client";
import PreviewFactoryBtn from "./PreviewFactoryBtn";
import SaveFactoryBtn from "./SaveFactoryBtn";
import PublishFactoryBtn from "./PublishFactoryBtn";
import EditorPane from "./EditorPane";

function EditFactory({factory}: {factory: ReceiptFactory}){

  return(
    <main>
      <nav>
        <div>
          <h2>
            <span>Factory:</span>
            {factory.name}
          </h2>
          <div>
            <PreviewFactoryBtn/>
            {!factory.published && (
              <>
                <SaveFactoryBtn />
                <PublishFactoryBtn/>
              </>
            )}
          </div>
        </div>
      </nav>
      <div>
        <EditorPane/>
      </div>
    </main>
  );
}

export default EditFactory;