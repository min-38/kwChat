import { useState, useEffect, useMemo } from "react";
import { Button, View, StyleSheet, Text, TextInput, ActivityIndicator} from "react-native"
import useGlobal from "../core/global"

function updatedTimeText(time) {
    if(time) {
        return (
            <View>
                <Text>
                    {time}에 저장됨
                </Text>
            </View>
        )
    }
    return ""
}

function MemoScreen({connectionId}) {

    const saveMemo = useGlobal(state => state.saveMemo)
    const updatedTime = useGlobal(state => state.memoSaveTime)
    
    const memoInfo = useGlobal(state => state.memoInfo)

    const [title, setTitle] = useState(memoInfo ? memoInfo.title : '')
    const [content, setContent] = useState(memoInfo ? memoInfo.content : '')

    // if (!memoLoad) {
	// 	return  (
	// 		<ActivityIndicator style={{ flex: 1 }} />
	// 	)
	// }

    return (
        <View
            style={{
                backgroundColor: 'lightgoldenrodyellow'
            }}
        >
            <View
                style={styles.modal}
            >
                {updatedTimeText(memoInfo ? memoInfo.updated_at : '')}
                <TextInput
                    style={{ 
                        fontSize: 20
                    }}
                    placeholder={"나만의 메모장"}
                    value={title}
                    onChangeText={setTitle}

                />
                <View>
                    <TextInput
                        multiline={true}
                        textAlignVertical="top"
                        placeholder={"내용"}
                        value={content}
                        onChangeText={setContent}
                    />
                </View>
            </View>
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />
            <Button
                title="저장"
                onPress={() => saveMemo(title, content, connectionId)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    modal: {
        height: 200,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 20,
        // backgroundColor: 'lightgoldenrodyellow'
    },
    // paper: {
    //     top: '50%',
    //     position: "absolute",
    //     height: 550,
    //     width: 450,
    //     backgroundColor: 'lightgoldenrodyellow'
    // }
});

export default MemoScreen