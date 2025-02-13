import { logDebug } from '@sourcegraph/cody-shared'
import { type ExecuteEditArguments, executeEdit } from '../../edit/execute'
import { getEditor } from '../../editor/active-editor'
import { DefaultEditCommands } from '@sourcegraph/cody-shared/src/commands/types'
import { defaultCommands } from '.'
import type { EditCommandResult } from '../../main'
import type { CodyCommandArgs } from '../types'

/**
 * The command that generates a new docstring for the selected code.
 * When calls, the command will be executed as an inline-edit command.
 *
 * Context: add by the edit command
 */
export async function executeDocCommand(
    args?: Partial<CodyCommandArgs>
): Promise<EditCommandResult | undefined> {
    logDebug('executeDocCommand', 'executing', { args })
    let prompt = defaultCommands.doc.prompt

    if (args?.additionalInstruction) {
        prompt = `${prompt} ${args.additionalInstruction}`
    }

    const editor = getEditor()?.active
    const document = editor?.document

    if (!document) {
        return undefined
    }

    return {
        type: 'edit',
        task: await executeEdit(
            {
                instruction: prompt,
                intent: 'doc',
                mode: 'insert',
            } satisfies ExecuteEditArguments,
            DefaultEditCommands.Doc
        ),
    }
}
