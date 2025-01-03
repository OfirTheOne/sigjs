import { Application, Converter, Context, ReflectionKind } from 'typedoc';

export function load(app: Application) {
  app.converter.on(Converter.EVENT_CREATE_DECLARATION, onCreateDeclaration);
}

function onCreateDeclaration(context: Context, reflection: any) {
  const comment = reflection.comment;
  if (comment && comment.tags) {
    const publicApiTag = comment.tags.find((tag: any) => tag.tagName === 'publicApi');
    if (!publicApiTag) {
      reflection.kind = null;
    }
  }
}