package registry

import (
	"sync"
)

var instance *Registry
var once sync.Once

type Registry struct {
	data map[string][]byte
}

// @Function: GetInstance
// @Description: Get the singleton instance of the registry
// @Return: *Registry
func GetInstance() *Registry {
	if instance == nil {
		instance = &Registry{
			data: make(map[string][]byte)}
	}
	return instance
}

// @Function: GetValue
// @Description: Get a value from the registry
// @Param: key string
// @Return: string
// @Return: bool
func (registryInstance *Registry) GetValueString(key string) (string, bool) {
	value, ok := registryInstance.GetValue(key)
	return string(value), ok
}

// @Function: SetValue
// @Description: Set a string value in the registry
// @Param: key string
// @Param: value string
func (registryInstance *Registry) SetValueString(key string, value string) {
	registryInstance.SetValue(key, []byte(value))
}

// @Function: GetValueBytes
// @Description: Get a value in the registry
// @Param: key string
// @Return: []byte
// @Return: bool
func (registryInstance *Registry) GetValue(key string) ([]byte, bool) {
	value, ok := registryInstance.data[key]
	return []byte(value), ok
}

// @Function: SetValue
// @Description: Set a []byte value in the registry
// @Param: key string
// @Param: value []byte
func (registryInstance *Registry) SetValue(key string, value []byte) {
	registryInstance.data[key] = value
}
