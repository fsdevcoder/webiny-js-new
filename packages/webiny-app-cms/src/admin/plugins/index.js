// @flow
//import { categories, pages } from "./search";
import header from "./pageDetails/header";
import revisionContent from "./pageDetails/revisionContent";
import previewContent from "./pageDetails/previewContent";
import pageRevisions from "./pageDetails/pageRevisions";

export default [...header, revisionContent, ...previewContent, pageRevisions];
