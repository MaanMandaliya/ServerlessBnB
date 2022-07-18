# -*- coding: utf-8 -*-

# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/api/service.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database

# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from google.api import auth_pb2 as google_dot_api_dot_auth__pb2
from google.api import backend_pb2 as google_dot_api_dot_backend__pb2
from google.api import billing_pb2 as google_dot_api_dot_billing__pb2
from google.api import context_pb2 as google_dot_api_dot_context__pb2
from google.api import control_pb2 as google_dot_api_dot_control__pb2
from google.api import documentation_pb2 as google_dot_api_dot_documentation__pb2
from google.api import endpoint_pb2 as google_dot_api_dot_endpoint__pb2
from google.api import http_pb2 as google_dot_api_dot_http__pb2
from google.api import log_pb2 as google_dot_api_dot_log__pb2
from google.api import logging_pb2 as google_dot_api_dot_logging__pb2
from google.api import metric_pb2 as google_dot_api_dot_metric__pb2
from google.api import (
    monitored_resource_pb2 as google_dot_api_dot_monitored__resource__pb2,
)
from google.api import monitoring_pb2 as google_dot_api_dot_monitoring__pb2
from google.api import quota_pb2 as google_dot_api_dot_quota__pb2
from google.api import source_info_pb2 as google_dot_api_dot_source__info__pb2
from google.api import system_parameter_pb2 as google_dot_api_dot_system__parameter__pb2
from google.api import usage_pb2 as google_dot_api_dot_usage__pb2
from google.protobuf import api_pb2 as google_dot_protobuf_dot_api__pb2
from google.protobuf import type_pb2 as google_dot_protobuf_dot_type__pb2
from google.protobuf import wrappers_pb2 as google_dot_protobuf_dot_wrappers__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(
    b"\n\x18google/api/service.proto\x12\ngoogle.api\x1a\x15google/api/auth.proto\x1a\x18google/api/backend.proto\x1a\x18google/api/billing.proto\x1a\x18google/api/context.proto\x1a\x18google/api/control.proto\x1a\x1egoogle/api/documentation.proto\x1a\x19google/api/endpoint.proto\x1a\x15google/api/http.proto\x1a\x14google/api/log.proto\x1a\x18google/api/logging.proto\x1a\x17google/api/metric.proto\x1a#google/api/monitored_resource.proto\x1a\x1bgoogle/api/monitoring.proto\x1a\x16google/api/quota.proto\x1a\x1cgoogle/api/source_info.proto\x1a!google/api/system_parameter.proto\x1a\x16google/api/usage.proto\x1a\x19google/protobuf/api.proto\x1a\x1agoogle/protobuf/type.proto\x1a\x1egoogle/protobuf/wrappers.proto\"\xda\x07\n\x07Service\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\r\n\x05title\x18\x02 \x01(\t\x12\x1b\n\x13producer_project_id\x18\x16 \x01(\t\x12\n\n\x02id\x18! \x01(\t\x12\"\n\x04\x61pis\x18\x03 \x03(\x0b\x32\x14.google.protobuf.Api\x12$\n\x05types\x18\x04 \x03(\x0b\x32\x15.google.protobuf.Type\x12$\n\x05\x65nums\x18\x05 \x03(\x0b\x32\x15.google.protobuf.Enum\x12\x30\n\rdocumentation\x18\x06 \x01(\x0b\x32\x19.google.api.Documentation\x12$\n\x07\x62\x61\x63kend\x18\x08 \x01(\x0b\x32\x13.google.api.Backend\x12\x1e\n\x04http\x18\t \x01(\x0b\x32\x10.google.api.Http\x12 \n\x05quota\x18\n \x01(\x0b\x32\x11.google.api.Quota\x12\x32\n\x0e\x61uthentication\x18\x0b \x01(\x0b\x32\x1a.google.api.Authentication\x12$\n\x07\x63ontext\x18\x0c \x01(\x0b\x32\x13.google.api.Context\x12 \n\x05usage\x18\x0f \x01(\x0b\x32\x11.google.api.Usage\x12'\n\tendpoints\x18\x12 \x03(\x0b\x32\x14.google.api.Endpoint\x12$\n\x07\x63ontrol\x18\x15 \x01(\x0b\x32\x13.google.api.Control\x12'\n\x04logs\x18\x17 \x03(\x0b\x32\x19.google.api.LogDescriptor\x12-\n\x07metrics\x18\x18 \x03(\x0b\x32\x1c.google.api.MetricDescriptor\x12\x44\n\x13monitored_resources\x18\x19 \x03(\x0b\x32'.google.api.MonitoredResourceDescriptor\x12$\n\x07\x62illing\x18\x1a \x01(\x0b\x32\x13.google.api.Billing\x12$\n\x07logging\x18\x1b \x01(\x0b\x32\x13.google.api.Logging\x12*\n\nmonitoring\x18\x1c \x01(\x0b\x32\x16.google.api.Monitoring\x12\x37\n\x11system_parameters\x18\x1d \x01(\x0b\x32\x1c.google.api.SystemParameters\x12+\n\x0bsource_info\x18% \x01(\x0b\x32\x16.google.api.SourceInfo\x12\x38\n\x0e\x63onfig_version\x18\x14 \x01(\x0b\x32\x1c.google.protobuf.UInt32ValueB\x02\x18\x01\x42n\n\x0e\x63om.google.apiB\x0cServiceProtoP\x01ZEgoogle.golang.org/genproto/googleapis/api/serviceconfig;serviceconfig\xa2\x02\x04GAPIb\x06proto3"
)


_SERVICE = DESCRIPTOR.message_types_by_name["Service"]
Service = _reflection.GeneratedProtocolMessageType(
    "Service",
    (_message.Message,),
    {
        "DESCRIPTOR": _SERVICE,
        "__module__": "google.api.service_pb2"
        # @@protoc_insertion_point(class_scope:google.api.Service)
    },
)
_sym_db.RegisterMessage(Service)

if _descriptor._USE_C_DESCRIPTORS == False:

    DESCRIPTOR._options = None
    DESCRIPTOR._serialized_options = b"\n\016com.google.apiB\014ServiceProtoP\001ZEgoogle.golang.org/genproto/googleapis/api/serviceconfig;serviceconfig\242\002\004GAPI"
    _SERVICE.fields_by_name["config_version"]._options = None
    _SERVICE.fields_by_name["config_version"]._serialized_options = b"\030\001"
    _SERVICE._serialized_start = 589
    _SERVICE._serialized_end = 1575
# @@protoc_insertion_point(module_scope)
