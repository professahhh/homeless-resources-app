import React from "react";
import { Image, Pressable, TextInput, TextInputSubmitEditingEvent, View } from "react-native";
import search from "@assets/images/search.png";
import clear from "@assets/images/closed.png";

type SearchBarProps = {
    onSearch: (text: string) => void;
    
    autoSearch?: boolean;
    extraClassName?: string;
}

export default function SearchBar({
    onSearch,
    autoSearch = false,
    extraClassName = "",
}: SearchBarProps) {
    const className = `bg-blue-500 flex-1 flex-row pl-12 pr-3 h-16 rounded-full ${extraClassName}`;
    const [searchText, setSearchText] = React.useState("");

    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleBlur = () => {
        setIsFocused(false);
    }

    const handleClear = () => {
        setSearchText("");
    }

    const changeTextHandler = (text: string) => {
        setSearchText(text);
        if (autoSearch) {
            onSearch(text);
        }
    }

    const keyPressHandler = (event: TextInputSubmitEditingEvent) => {
        event.persist();
        onSearch(searchText);
    }
    
    return (
        <View className={className}>
            <Image source={search} className="w-8 h-8 absolute top-4 left-3" />
            <TextInput
                className="w-full my-2 px-4 rounded-full bg-slate-100"
                style={{ fontSize: 16 }}
                placeholder="Search for resources..."
                placeholderTextColor="#94a3b8"
                autoCorrect={false}
                autoCapitalize="none"
                inputMode="search"
                clearButtonMode="while-editing"
                value={searchText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={changeTextHandler}
                onSubmitEditing={keyPressHandler}
            />
            {(isFocused || searchText.length > 0) &&
                <Pressable onPress={handleClear}>
                    <Image source={clear} className="w-6 h-6 absolute top-5 right-3" />
                </Pressable>
            }
        </View>
    );
}